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

    let today = new Date();
    console.log("Today date is " + today);
    today.setHours(48, 0, 0, 0);
    console.log("Today date adjusted is " + today);
    console.log(today.toISOString());

    if (req.task === "bookings") {
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
                                            bookingCallback();
                                        }
                                    })
                            } else {
                                counter++;
                                if (counter === user.bookings.length) {
                                    bookingCallback();
                                }
                            }
                        })
                });

                function bookingCallback() {
                    //console.log(bookings);
                    let output = '';
                    if (slots.length !== 0) {
                        slots.sort(function (a, b) { return a.startTime - b.startTime });

                        slots.forEach((s) => {
                            if (s.startTime > 12) {
                                output = output + "Your Slot on " + s.date.toUTCString().substring(0, 16) + " is at " + (s.startTime - 12) + "pm." + "\n";
                            } else if (s.startTime === 12) {
                                output = output + "Your Slot on " + s.date.toUTCString().substring(0, 16) + " is at " + s.startTime + "pm" + "\n";
                            } else {
                                output = output + "Your Slot on " + s.date.toUTCString().substring(0, 16) + " is at " + s.startTime + "am" + "\n";
                            }
                        })
                        axios.post(`${TELEGRAM_API}/sendMessage`, {
                            chat_id: req.chatID,
                            text: output
                        })
                        console.log("Sent booking details on Telegram to " + req.telegramHandle);
                    } else {
                        axios.post(`${TELEGRAM_API}/sendMessage`, {
                            chat_id: req.chatID,
                            text: "You have no upcoming bookings"
                        })
                        console.log("No Slots found for " + req.telegramHandle);
                    }
                }
            });
    } else if (req.task === "fetch") {
        Slot.find({
            date: { $gt: today.toISOString() }
        })
            .exec((err, slots) => {

                if (err) {
                    return res.status(500).send({ message: err });
                }
                //console.log(slots);
                let counter = 0;
                let validSlots = [];

                let now = new Date();
                console.log("Now is " + now);
                let later = new Date(Date.now() + 8 * (60 * 60 * 1000));
                console.log("Later is " + later);

                slots.forEach(s => {
                    console.log(s)
                    counter++;
                    if (s.capacity > 0 && s.fullCapacity > 0) {
                        console.log("Slot start time is " + s.startTime);
                        console.log("Now hour is " + now.getHours());
                        let timeDiff = s.startTime >= now.getHours();
                        console.log("Slot is after Now is " + timeDiff)
                        if (timeDiff) {
                            validSlots.push(s);
                        }
                    }
                    if (counter === slots.length) {
                        fetchCallback();
                    }
                })

                function fetchCallback() {
                    console.log("callback for bookings");
                    console.log(validSlots);
                }
            })
    }

};

const botRequest = {
    teleRequest
};

module.exports = botRequest;