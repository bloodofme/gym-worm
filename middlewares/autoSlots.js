const db = require("../models");
const Slot = db.slot;
const SlotSetting = db.slotSetting;
const axios = require("axios");

const deployTo = "heroku" // change between "local" or "heroku"
const API_URL = (deployTo === "heroku") ? "https://gym-worm.herokuapp.com/api/slot/" : "http://localhost:5000/api/slot/";

generateSlots = (req, res) => {
    //console.log("generateSlots Process Start");

    SlotSetting.findOne({
        _id: "60e5d754014b442d5c4b137a"
    }).exec((err, slotSettings) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        const slotDate = req.date;
        const startTime = slotSettings.startTime;
        const endTime = slotSettings.endTime;
        const capacity = slotSettings.capacity;

        console.log("Slot Generation Request Date for " + slotDate);

        // checking if slots already exist
        Slot.find({
            date: req.date
        })
            .exec((err, slots) => {
                if (err) {
                    return res.status(500).send({ message: err });
                }

                // if no slots are found for that day, create slots using Slot Settings
                if (slots.length === 0) {
                    console.log("Slots not found.");

                    for (let i = startTime; i < endTime; i++) {
                        //console.log("current i is " + i);

                        axios.post(API_URL + 'createSlot', { date: slotDate, startTime: i, capacity: capacity })
                            .then((res) => { console.log("Slot Created") }
                                , (err) => { console.log(err) });
                    }
                } else { // if slots are found, nothing needs to be done
                    console.log("Slots for " + slotDate + " already exist.");
                }
            });
    });
};

const autoSlots = {
    generateSlots
};

module.exports = autoSlots;