const db = require("../models");
const User = db.user;
const axios = require("axios");

const deployTo = "local" // change between "local" or "heroku"
const API_URL = (deployTo === "heroku") ? "https://gym-worm.herokuapp.com/api/auth/" : "http://localhost:5000/api/auth/";

checkAll = (req, res) => {
    console.log("Check All Ban Request");

    User.find(
        { roles: ["60b1c125bd27f021c95570eb"] }, { _id: 1, email: 1, banStatus: 1, banDuration: 1, banStartDate: 1 }
    )
        .exec((err, users) => {
            function callback() {
                console.log("Ban Checks Done");
                return res.status(200).send({ message: "Bans Checked" });
            }

            if (err) {
                console.log(err);
            }

            let counter = 0;
            let doneCounter = 0;
            const today = new Date();

            users.forEach((u) => {
                if (u.banStatus) { // if ban is active
                    let dateDiff = (today.getTime() - new Date(u.banStartDate).getTime()) / (1000 * 3600 * 24);
                    counter++;

                    if (dateDiff > u.banDuration) {
                        axios.put(API_URL + 'update', { email: u.email, banStatus: false, banStartDate: today, banDuration: 0 })
                            .then(() => {
                                doneCounter++;
                                console.log("Ban Status Lifted for " + u.email);
                                if (counter === doneCounter) {
                                    callback();
                                }
                            }
                                , (err) => { console.log(err) });
                    }
                } else { // if ban is not active
                    let dateDiff2 = (today.getTime() - new Date(u.banStartDate).getTime()) / (1000 * 3600 * 24);
                    counter++;

                    if (dateDiff2 > 30) {
                        axios.put(API_URL + 'update', { email: u.email, banStartDate: today, banDuration: 0, creditCounter: 0, banCounter: 0, creditScore: 100 })
                            .then(() => {
                                doneCounter++;
                                console.log("Credits Reset for " + u.email);
                                if (counter === doneCounter) {
                                    callback();
                                }
                            }
                                , (err) => { console.log(err) });
                    }
                }
            })
        })
}

checkUser = (req, res, next) => {
    console.log("Check User Ban Request for " + req.body.email);

    User.findOne(
        { email: req.body.email }, { _id: 1, email: 1, banStatus: 1, banDuration: 1, banStartDate: 1 }
    )
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user === undefined || user === null) {
                return res.status(460).send({ message: "No user to check" });
                next();
            } else {
                const today = new Date();

                if (user.banStatus) { // if ban is active
                    let dateDiff = (today.getTime() - new Date(user.banStartDate).getTime()) / (1000 * 3600 * 24); // convert difference into hours

                    if (dateDiff > user.banDuration) {
                        axios.put(API_URL + 'update', { email: user.email, banStatus: false, banStartDate: today, banDuration: 0 })
                            .then(() => {
                                console.log("Ban Status Lifted for " + user.email);
                            }
                                , (err) => { console.log(err) });
                    } else {
                        console.log("Ban Status still Active for " + user.email + " until " + (new Date(user.banStartDate.getTime() + (7 * 24 * 60 * 60 * 1000))) );
                    }
                } else { // if ban is not active
                    let dateDiff2 = (today.getTime() - new Date(user.banStartDate).getTime()) / (1000 * 3600 * 24);

                    if (dateDiff2 > 30) { // check that 30 days has past since last update
                        axios.put(API_URL + 'update', { email: user.email, banStartDate: today, banDuration: 0, creditCounter: 0, banCounter: 0, creditScore: 100 })
                            .then(() => {
                                console.log("Credits Reset for " + user.email);
                            }
                                , (err) => { console.log(err) });
                    }
                }
                next();
            }
        })
}

const checkBans = {
    checkAll,
    checkUser
};

module.exports = checkBans;