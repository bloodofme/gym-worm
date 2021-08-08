const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Booking = db.booking;
const Slot = db.slot;
const nodemailer = require('nodemailer');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gymworm.team@gmail.com',
    pass: 'Orbital123!@#'
  }
},
  {
    from: '"GymWorm" <gymworm.team@gmail.com>',
  });

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

    function sendMail() { // Send Registration Confirmation Mail to User
      const output = `
      <p>Hello ${user.firstName},</p>
      <br>
      <h3>Welcome to GymWorm!</h3>
      <p>Start your journey to fitness by booking your slots <a href="https://gym-worm.herokuapp.com/">here</a> now!</p>
      
      <p><u>If you did not create this account</u>, let us know by replying to this email.</p>
      <br>
      <p>Regards,</p>
      <p>GymWorm Team</p>
      <a href="https://gym-worm.herokuapp.com/">GymWorm Website</a>
      <a href="https://t.me/GymWorm_bot">   Telegram Bot</a>
      <a href="https://t.me/joinchat/LEL7TuOMqLozNWVl">   Support Chat</a>
    `;

      let mailOptions = {
        to: user.email,
        subject: 'GymWorm Signup',
        text: 'GymWorm Signup',
        html: output
      };

      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log('Error sending Email' + err);
        } else {
          console.log('Email sent to ' + user.email);
        }
      });
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
            sendMail();
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
          sendMail();
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

      if (user === undefined || user === null) {
        return res.status(404).send({ message: "No account with that email found" });
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
      if (req.body.creditCounter !== undefined) {
        user.creditCounter = req.body.creditCounter
      }
      if (req.body.banCounter !== undefined) {
        user.banCounter = req.body.banCounter
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
        user.banStartDate = Date.parse(req.body.banStartDate)
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

      let today = new Date();
      console.log("Today's time is " + today + " and the Hour is " + today.getHours());

      Slot.findOne({
        _id: req.body.slotID
      })
        .exec((err, slot) => {
          if (err) {
            return res.status(400).send({ message: err });
          }
          // if now hour - start time < 2 then cannot cancel
          console.log("Cancelling slot's start time is " + slot.startTime);

          if ((today.getHours() - slot.startTime) < 2) {
            if (today.getDate() === slot.date.getDate()) {
              console.log("Slot is less than 2 hours away, cancelling not allowed");
              return res.status(404).send({ message: "Slot is less than 2 hour away" });
            }
            console.log("Slot is more than 2 hours away, cancelling is ok");

            Booking.findOne({
              "user": user._id, "slot": slot._id, "valid": true
            })
              .exec((err, booking) => {
                if (err) {
                  return res.status(400).send({ message: err });
                }

                if (booking) {
                  console.log("Booking " + booking._id + " found with validity " + booking.valid);
                  console.log("User's booking updated from");
                  console.log(user.bookings);
                  user.bookings.pull({ _id: booking._id });
                  booking.valid = false;
                  console.log("User's booking updated to");
                  console.log(user.bookings);
                  booking.save((err, newBooking) => {
                    if (err) {
                      return res.status(400).send({ message: err })
                    }
                    user.creditCounter--;

                    user.save((err, newUser) => {
                      if (err) {
                        return res.status(400).send({ message: err })
                      }
                      //return res.status(200).send({ message: "Booking is removed for user" });
                      console.log("Booking is updated as invalid and removed for user");
                      return res.status(200).send({ message: "Booking is updated as invalid and removed for user" })
                    });
                    //console.log(newBooking);
                  });
                }
              });
          } else {
            console.log("Slot is more than 2 hours away, cancelling is ok");

            Booking.findOne({
              "user": user._id, "slot": slot._id, "valid": true
            })
              .exec((err, booking) => {
                if (err) {
                  return res.status(400).send({ message: err });
                }

                if (booking) {
                  console.log("Booking " + booking._id + " found with validity " + booking.valid);
                  console.log("User's booking updated from");
                  console.log(user.bookings);
                  user.bookings.pull({ _id: booking._id });
                  booking.valid = false;
                  console.log("User's booking updated to");
                  console.log(user.bookings);
                  booking.save((err, newBooking) => {
                    if (err) {
                      return res.status(400).send({ message: err })
                    }
                    user.creditCounter--;

                    user.save((err, newUser) => {
                      if (err) {
                        return res.status(400).send({ message: err })
                      }
                      //return res.status(200).send({ message: "Booking is removed for user" });
                      console.log("Booking is updated as invalid and removed for user");
                      return res.status(200).send({ message: "Booking is updated as invalid and removed for user" })
                    });
                    //console.log(newBooking);
                  });

                }
              });
          }
        })


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

      user.banCounter++;

      let counter = 4 + user.creditCounter
      //console.log("counter is " + counter + ", banCounter is " + user.banCounter);

      let score = ((counter - user.banCounter) / counter) * 100;
      //console.log("score is " + score);

      console.log(parseFloat(score).toFixed(2));
      user.creditScore = score;
      const today = new Date();

      if (score < 65) {
        user.banStatus = true;
        user.banStartDate = Date.parse(today);
        user.creditScore = score;
        user.banDuration = 14;
      } else if (score < 75) {
        user.banStatus = true;
        user.banStartDate = Date.parse(today);
        user.creditScore = score;
        user.banDuration = 7;
      }

      user.save((err, newUser) => {
        if (err) {
          return res.status(400).send({ message: err })
        }
        return res.status(200).send(newUser);
      })
    });
}

exports.teleFetchSlot = (req, res) => {
  if (req) {
    console.log("teleFetchSlot req for " + req.body.telegramHandle);
  }

  User.findOne({
    telegramHandle: req.body.telegramHandle
  })
    .exec((err, user) => {
      //console.log(user)
      if (!user) {
        return res.status(404).send({
          message: "no user found"
        })
      }

      function callback() {
        //console.log(slots);
        slots.sort(function (a, b) { return a.startTime - b.startTime });
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
        })
          .exec((error, book) => {
            if (book.valid) {
              //console.log(book);
              Slot.findOne({
                _id: book.slot
              }, { _id: 1, date: 1, startTime: 1, capacity: 1 })
                .exec((err, slot) => {
                  //console.log(slot);
                  let today = new Date();
                  today.setHours(8, 0, 0, 0);
                  //console.log(today);
                  if (new Date(slot.date).getTime() >= today.getTime()) {
                    slots.push(slot);
                  }
                  counter++;
                  if (counter === user.bookings.length) {
                    callback();
                  }
                })
            } else {
              counter++;
              if (counter === user.bookings.length) {
                callback();
              }
            }
          })
      });
    });
}

exports.resetPasswordReq = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      console.log("Reset Change Request for " + req.body.email);
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
        return;
      }

      if (user === undefined || user === null) {
        return res.status(404).send({ message: "No account with that email found" });
      } else {
        const resetPassword = "lMNop" + user.lastName;
        console.log("Temp un-hashed password of " + resetPassword);
        user.password = (bcrypt.hashSync(resetPassword, 1)).substring(0, 10);
        console.log("Temp hashed password of " + user.password);

        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 14400 // 4 hours
        });

        user.save((err, newUser) => {
          if (err) {
            return res.status(400).send({ message: err })
          }
          console.log("Password for " + newUser.email + " has been reset.");

          function sendMailToUser() { // Send reset code to user
            const output = `
            <p>Hello ${newUser.firstName},</p>
            <br>
            <p>Use code <b>${newUser.password}</b> to reset your password <a href="https://gym-worm.herokuapp.com/ChangePassword">here</a>.</p>
            
            <p><u>If you did not make this request</u> to reset your GymWorm password, let us know by replying to this email.</p>
            <br>
            <p>Regards,</p>
            <p>GymWorm Team</p>
            <a href="https://gym-worm.herokuapp.com/">GymWorm Website</a>
            <a href="https://t.me/GymWorm_bot">   Telegram Bot</a>
            <a href="https://t.me/joinchat/LEL7TuOMqLozNWVl">   Support Chat</a>
          `;

            let mailOptions = {
              to: newUser.email,
              bcc: 'gymworm.team@gmail.com',
              subject: 'GymWorm Reset Password Request',
              text: 'GymWorm Reset Password',
              html: output
            };
            console.log("Email sending");
            transporter.sendMail(mailOptions, function (err, data) {
              if (err) {
                console.log('Error sending Email' + err);
              } else {
                console.log('Email sent to ' + newUser.email);
              }
            });
          }

          sendMailToUser();
          return res.status(200).send({
            message: "Password reset, Please set new password with " + newUser.password
          });
        });
      }
    });
};

exports.changePasswordSet = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec((err, user) => {
      console.log("Password Change Set Request for " + req.body.email);
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
        return;
      }

      if (user === undefined || user === null) {
        console.log("Account not found");
        return res.status(404).send({ message: "No account with that email found" });
      }

      if (req.body.tempPassword !== user.password) {
        console.log("Reset code given is invalid");
        return res.status(200).send({
          message: "Reset code is invalid"
        });
      }

      if (req.body.newPassword !== undefined) {
        if (req.body.newPassword.length < 6) {
          console.log("Password is too short");
          return res.status(401).send({
            message: "New Password needs to be at least 6 characters!"
          });
        }
        user.password = bcrypt.hashSync(req.body.newPassword, 8)
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 14400 // 4 hours
      });

      user.save((err, newUser) => {
        if (err) {
          return res.status(400).send({ message: err })
        }
        console.log("Password changed for " + newUser.email);
        return res.status(200).send({
          message: "Password changed for " + newUser.email
        });
      });
    });
};