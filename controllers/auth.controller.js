const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Booking = db.booking;
const Slot = db.slot;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  console.log("signing up for " + req.body.email);

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    creditScore: 100,
    contactNo: req.body.contactNo,
    roles: req.body.roles,
    telegramHandle: req.body.telegramHandle
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 14400 // 4 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      console.log(user.email + " logging in");
      console.log(authorities);

      res.status(200).send({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        creditScore: user.creditScore,
        roles: authorities,
        contactNotification: user.contactNotification,
        emailNotification: user.emailNotification,
        telegramNotification: user.telegramNotification,
        telegramHandle: user.telegramHandle,
        contactNo: user.contactNo,
        banStatus: user.banStatus,
        banDuration: user.banDuration,
        banStartDate: user.banStartDate,
        accessToken: token,
        bookings: user.bookings
      });
    });
};

exports.update = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      console.log("user update request");
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
        return;
      }
      if (req.body.firstName !== undefined) {
        user.firstName = req.body.firstName
      }
      if (req.body.lastName !== undefined) {
        user.lastName = req.body.lastName
      }
      if (req.body.emailNotification !== undefined) {
        user.emailNotification = req.body.emailNotification
      }
      if (req.body.telegramNotification !== undefined) {
        user.telegramNotification = req.body.telegramNotification
      }
      if (req.body.contactNotification !== undefined) {
        user.contactNotification = req.body.contactNotification
      }
      if (req.body.contactNo !== undefined) {
        if (!(req.body.contactNo.length === 8)) {
          return res.status(401).send({
            message: "New Contact Number is Invalid! Should be 8 digits."
          });
        } else if (!(req.body.contactNo.charAt(0) === '8' || req.body.contactNo.charAt(0) === '9')) {
          return res.status(401).send({
            message: "New Contact Number is Invalid! Should start with 8 or 9."
          });
        }
        user.contactNo = req.body.contactNo
      }
      if (req.body.creditScore !== undefined) {
        user.creditScore = req.body.creditScore
      }
      if (req.body.password !== undefined) {
        if (req.body.password.length < 6) {
          return res.status(401).send({
            message: "New Password is Invalid!"
          });
        }
        user.password = bcrypt.hashSync(req.body.password, 8)
      }

      if (req.body.bookingID !== undefined) {
        user.bookings.push(req.body.bookingID)
      }

      if (req.body.banStatus !== undefined) {
        user.banStatus = req.body.banStatus
      }
      if (req.body.banDuration !== undefined) {
        user.banDuration = req.body.banDuration
      }
      if (req.body.banStartDate !== undefined) {
        user.banStartDate = req.body.banStartDate
      }
      if (req.body.telegramHandle !== undefined) {
        user.telegramHandle = req.body.telegramHandle
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 14400 // 4 hours
      });

      user.save((err, newUser) => {
        if (err) {
          return res.status(400).send({ message: err })
        }
        return res.status(200).send({
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password,
          creditScore: newUser.creditScore,
          roles: req.body.roles,
          contactNotification: newUser.contactNotification,
          emailNotification: newUser.emailNotification,
          telegramNotification: newUser.telegramNotification,
          telegramHandle: newUser.telegramHandle,
          contactNo: newUser.contactNo,
          banStatus: newUser.banStatus,
          banDuration: newUser.banDuration,
          banStartDate: newUser.banStartDate,
          accessToken: token,
          bookings: newUser.bookings
        });
      });
    });
};

exports.updateSignin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }


      if (req.body.password !== user.password) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 14400 // 4 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      console.log("Updated for " + user.email);

      res.status(200).send({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        creditScore: user.creditScore,
        roles: authorities,
        contactNotification: user.contactNotification,
        emailNotification: user.emailNotification,
        telegramNotification: user.telegramNotification,
        telegramHandle: user.telegramHandle,
        contactNo: user.contactNo,
        banStatus: user.banStatus,
        banDuration: user.banDuration,
        banStartDate: user.banStartDate,
        accessToken: token,
        bookings: user.bookings
      });
    });
};

exports.cancelBooking = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      console.log("cancelBooking user id is " + user.id);
      console.log("cancelBooking slot id is " + req.body.slotID);

      Booking.findOne({
        "user": user._id, "slot": req.body.slotID, "valid": true
      })
        .exec((err, booking) => {
          if (err) {
            return res.status(400).send({ message: err });
          }

          if (booking) {
            console.log("found");
            console.log(booking._id);
            console.log(booking.valid);
            console.log("before");
            console.log(user.bookings);
            user.bookings.pull({ _id: booking._id });
            booking.valid = false;
            console.log("after");
            console.log(user.bookings);
            console.log(booking.valid);
            booking.save((err, newBooking) => {
              if (err) {
                return res.status(400).send({ message: err })
              }
              console.log(newBooking);
            });

            user.save((err, newUser) => {
              if (err) {
                return res.status(400).send({ message: err })
              }
              return res.status(200).send({ message: "Booking is removed for user" });
            });
          }
        });

      /*console.log("311");
      console.log(user.bookings);
      user.save((err, newUser) => {
        if (err) {
          return res.status(400).send({ message: err })
        }
        return res.status(200).send({ message: "Booking is removed for user" });
      });*/
      //return res.status(400).send({ message: "No update made"});
    });
};

exports.listEmailNotif = (req, res) => {
  if (req) {
    console.log("listEmailNotif req exist");
  }

  User.find({
    roles: ["60b1c125bd27f021c95570eb"],
    emailNotification: true
  }, { firstName: 1, lastName: 1, email: 1 })
    .exec((err, users) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      return res.status(200).send({
        mailingList: users
      });
    });
};

exports.listAllCustomers = (req, res) => {
  if (req) {
    console.log("listAllCustomers req exist");
  }

  User.find({
    roles: ["60b1c125bd27f021c95570eb"],
  }, { firstName: 1, lastName: 1, email: 1, contactNo: 1, banStatus: 1 })
    .exec((err, users) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      return res.status(200).send({
        customerList: users
      });
    });
};

exports.listSlotCustomers = (req, res) => {
  if (req) {
    console.log(req.body.userID)
    console.log("listAllCustomers req exist");
    console.log(req.body)
  }

  User.findOne({
    _id: req.body.userID
  }, { firstName: 1, lastName: 1, email: 1, banStatus: 1, banDuration: 1 })
    .exec((err, users) => {
      console.log(users)
      if (err) {
        return res.status(500).send({ message: err });
      } 

      return res.status(200).send({
        users
      });
    });
};

exports.listOneCustomer = (req, res) => {
  if (req) {
    console.log("listOneCustomer req exist");
  }

  User.findOne({
    _id: req.body.userID
  })
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      return res.status(200).send({
        user
      });
    });
};

// unfinished code
exports.demeritUser = (req, res) => {
  User.findOne({
    _id: req.body.userID
  })
    .exec((err, user) => {
      console.log("demeritUser req");
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      return res.status(200).send({ message: "nothing coded yet" })
    });
}

exports.teleFetchSlot = (req, res) => {
  if (req) {
    console.log("teleFetchSlot req exist");
  }

  User.findOne({
    telegramHandle: req.body.telegramHandle
  })
    .exec((err, user) => {

      function callback() {
        //console.log(bookings);
        return res.status(200).send({
          slots
        });
      }

      if (err) {
        return res.status(500).send({ message: err });
      }

      //console.log(user.bookings);

      let slots = [];
      //console.log(bookings);
      let counter = 0;

      user.bookings.forEach((b) => {
        //console.log(b);
        Booking.findOne({
          _id: b,
          valid: true
        })
          .exec((error, book) => {
            //console.log(book);
            Slot.findOne({
              _id: book.slot
            }, {_id: 1, date: 1, startTime: 1, capacity: 1})
              .exec((err, slot) => {
                console.log(slot);
                slots.push(slot);
                counter++;
                if (counter === user.bookings.length) {
                  callback();
                }
              })

          })
      });
    });
}

