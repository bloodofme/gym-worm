const db = require("../models");
const Slot = db.slot;
const User = db.user;
const Booking = db.booking;
const axios = require("axios");
const TOKEN = process.env.TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

const API_URL = /*https://gym-worm.herokuapp.com/api/auth/ || */"http://localhost:5000/api/auth/";

teleRequest = (req, res) => {
    console.log("teleRequest Start");
    //console.log(req)

    if (req) {
        console.log("teleFetchSlot req for " + req.telegramHandle);
    }

    User.findOne({
        telegramHandle: req.telegramHandle
    })
        .exec((err, user) => {
            if (err) {
                return res.status(500).send({ message: err });
            }

            let slots = [];
            let counter = 0;
            let today = new Date();
            //console.log("Today date is " + today);
            today.setHours(0, 0, 0, 0);
            //console.log("Today date adjusted is " + today);

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

            function callback() {
                //console.log(bookings);
                let output = '';
                if (slots.length !== 0) {
                    slots.forEach((s) => {
                        //console.log("s date is");
                        //console.log(s.date);
                        //console.log(s.date.toUTCString());
                        //console.log(s.date.toUTCString().substring(0,16));
                        output = output + "Your Slot on " + s.date.toUTCString().substring(0,16) + " is at " + s.startTime + "\n";
                    })
                    axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: req.chatID,
                        text: output
                    })
                    console.log("Sent to Telegram for " + req.telegramHandle);
                } else {
                    axios.post(`${TELEGRAM_API}/sendMessage`, {
                        chat_id: req.chatID,
                        text: "You have no upcoming bookings"
                    })
                    console.log("No Slots found for " + req.telegramHandle);
                }
            }
        });
};

const botRequest = {
    teleRequest
};

module.exports = botRequest;