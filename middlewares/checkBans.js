const db = require("../models");
const User = db.user;
const axios = require("axios");

const API_URL = "https://gym-worm.herokuapp.com/api/slot/" /*|| "http://localhost:5000/api/slot/"*/;

checkAll = (req, res) => {
    //console.log("received");
    
    User.find(
        { roles: ["60b1c125bd27f021c95570eb"] }, { _id: 1, email: 1, banStatus: 1, banDuration: 1, banStartDate: 1 }
    )
        .exec((err, user) => {
            function callback() {
                console.log("Ban Checks Done");
                return res.status(200).send({ message: "Bans Checked" });
            }

            if (err) {
                console.log(err);
            }

            let counter = 0;
            let doneCounter = 0;
            user.forEach((u) => {
                const today = new Date();

                if (u.banStatus) {
                    let dateDiff = (today.getTime() - new Date(u.banStartDate).getTime()) / (1000 * 3600 * 24);
                    counter++;

                    if (dateDiff >= u.banDuration) {
                        axios.put(API_URL + 'update', { email: u.email, banStatus: false, banStartDate: today, banDuration: 0 })
                            .then(() => {
                                doneCounter++;
                                console.log("Ban Status Updated to False");
                                if (counter === doneCounter) {
                                    callback();
                                }
                            }
                                , (err) => { console.log(err) });
                    }
                } else {
                    let dateDiff2 = (today.getTime() - new Date(u.banStartDate).getTime()) / (1000 * 3600 * 24);
                    counter++;

                    if (dateDiff2 >= 30) {
                        axios.put(API_URL + 'update', { email: u.email, banStatus: false, banStartDate: today, banDuration: 0 })
                            .then(() => {
                                doneCounter++;
                                console.log("Ban Status Updated");
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

const checkBans = {
    checkAll
};

module.exports = checkBans;