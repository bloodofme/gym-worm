const db = require("../models");
const User = db.user;
const Slot = db.slot;
const Booking = db.booking;
const SlotSetting = db.slotSetting;

// createSlot takes in Date, Starting time, Capacity and creates a slot
exports.createSlot = (req, res) => {
  if (req) {
    console.log("createSlot req exist");
  }

  const date = Date.parse(req.body.date);
  const startTime = Number(req.body.startTime);
  const capacity = Number(req.body.capacity);
  const fullCapacity = Number(req.body.capacity);

  Slot.find({
    date: req.body.date,
    startTime: req.body.startTime
  })
    .exec((err, slot) => {
      console.log(slot);
      console.log(slot.length);

      if (slot.length !== 0) {
        console.log(req.body.date + " for time " + req.body.startTime + " already created");
        return res.status(403).json('Slot already exists');
      } else {
        console.log("Creating slot for " + req.body.date + " at " + req.body.startTime);
        const newSlot = new Slot({
          date,
          startTime,
          capacity,
          fullCapacity
        });

        newSlot.save()
          .then(() => res.send({ message: 'Slot Created!' }))
          .catch(err => res.status(500).json('Error: ' + err));
      } 
    });
}

// createSlot takes in Slot ID, Date, Starting time, Capacity or Full Capacity and updates the slot if it exists
exports.updateSlot = (req, res) => {
  if (req) {
    console.log("updateSlot req exist");
  }

  Slot.findOne({ _id: req.body.slotID }, (err, slot) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.startTime !== undefined) {
      slot.startTime = req.body.startTime
    }
    if (req.body.capacity !== undefined) {
      slot.capacity = req.body.capacity
    }
    if (req.body.fullCapacity !== undefined) {
      slot.fullCapacity = req.body.fullCapacity
    }
    if (req.body.date !== undefined) {
      slot.date = Date.parse(req.body.date)
    }

    slot.save((err, updatedSlot) => {
      if (err) {
        return res.status(400).send({ message: err })
      }
      console.log("Slot is successful updated");
      return res.send(updatedSlot);
    });
  });
}

exports.fetchSlots = (req, res) => {
  if (req) {
    console.log("fetchSlots req exist");
  }
  console.log(req.body.currentDate);

  Slot.find({
    date: req.body.currentDate
  })
    .exec((err, slots) => {
      if (err) {
        return res.status(500).send({ message: req });
      }

      if (slots.length === 0) {
        return res.status(404).send({ message: "Slots not found." });
      }

      //console.log(slots);

      return res.status(200).send({
        getSlots: slots
      });
    });

};

exports.bookSlot = (req, res) => {
  if (req) {
    console.log("bookSlot req exist");
  }
  console.log("slot id " + req.body.slotID);
  console.log("user id " + req.body.userID + " user email " + req.body.userEmail);
  Slot.findOne({ _id: req.body.slotID }, (err, slot) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    slot.userList.push(req.body.userID);

    if (slot.capacity > 0) {
      slot.capacity--;
    } else { // add in wait list later on
      return res.status(400).send({ message: "Slot is already full" });
    }

    slot.save((err, updatedSlot) => {
      if (err) {
        return res.status(400).send({ message: err })
      }
      console.log("Slot booking is successful");
      return res.send(updatedSlot);
    });
  });
};

exports.recordBooking = (req, res) => {
  if (req) {
    console.log("recordBooking req exist");
  }
  console.log("slot id " + req.body.slotID);
  console.log("user id " + req.body.userID);

  const newBooking = new Booking({
    user: req.body.userID,
    slot: req.body.slotID,
    dateOfBooking: new Date()
  });

  newBooking.save((err, booking) => {
    if (err) {
      return res.status(400).send({ message: err })
    }
    console.log("Booking is successfully recorded");
    console.log("Adding booking to user's records");

    console.log("Booking id is " + booking.id);

    User.findOne({
      _id: req.body.userID
    })
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (booking.id !== undefined) {
          user.bookings.push({ _id: booking.id });
        }

        user.save((err, newUser) => {
          if (err) {
            return res.status(400).send({ message: err })
          }
          //return res.status(200).send(newUser);
        });
      });

    return res.send(booking);
  });
};

exports.cancelledBooking = (req, res) => {
  if (req) {
    console.log("cancelledSlot req exist");
  }
  console.log("slot id " + req.body.slotID);
  console.log("user id " + req.body.userID);
  Slot.findOne({ _id: req.body.slotID }, (err, slot) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    slot.userList.pull({ _id: req.body.userID });
    slot.capacity++;

    slot.save((err, updatedSlot) => {
      if (err) {
        return res.status(400).send({ message: err })
      }
      console.log("Slot cancellation and update is successful");
      return res.send(updatedSlot);
    });
  });
};

exports.retrieveSlot = (req, res) => {
  if (req) {
    console.log("retrieveSlot req exist " + req.body.bookingID);
  }
  //console.log("Booking ID " + req.body.bookingID);

  Booking.find({
    _id: req.body.bookingID,
  })
    .exec((err, booking) => {
      if (err) {
        return res.status(500).send({ message: req });
      }
      //console.log(booking);
      if (booking.valid) {
        Slot.findOne({ _id: booking[0].slot }, (err, slot) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          return res.status(200).send({ slot });
        });
      } else {
        return res.status(404).send({ message: "No Valid Slot" });
      }
    });
};

exports.createSlotSetting = (req, res) => {
  if (req) {
    console.log("createSlotSetting req exist");
  }

  const startTime = Number(req.body.startTime);
  const endTime = Number(req.body.endTime);
  const capacity = Number(req.body.capacity);
  console.log("start time is " + startTime);
  console.log("end time is " + endTime);

  /*for (let i = startTime; i < endTime; i++) {
    console.log("time is " + i);
  }*/

  const setting = new SlotSetting({
    startTime,
    endTime,
    capacity,
    fullCapacity
  });

  setting.save()
    .then(() => res.status(200).send({ message: 'Slot Setting Created!' }))
    .catch(err => res.status(500).json('Error: ' + err));
}

exports.updateSlotSetting = (req, res) => {
  if (req) {
    console.log("updateSlotSetting req exist");
  }

  SlotSetting.findById("60e5d754014b442d5c4b137a", (err, setting) => {
    if (req.body.startTime !== undefined) {
      setting.startTime = req.body.startTime
    }
    if (req.body.endTime !== undefined) {
      setting.endTime = req.body.endTime
    }
    if (req.body.capacity !== undefined) {
      setting.capacity = req.body.capacity
    }

    setting.save((err, updatedSetting) => {
      if (err) {
        return res.status(400).send({ message: err })
      }
      console.log("Slot Settings is successful updated");
      return res.status(200).send(updatedSetting);
    });
  });
}

exports.getSlotSetting = (req, res) => {
  if (req) {
    console.log("getSlotSetting req exist");
  }

  SlotSetting.findById("60e5d754014b442d5c4b137a", (err, setting) => {
    console.log(setting);
    return res.status(200).send(setting);
  });
}