const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const autoSlots = require("./autoSlots");
const checkBans = require("./checkBans");
const botRequest = require("./botRequest");

module.exports = {
  authJwt,
  verifySignUp,
  autoSlots,
  checkBans,
  botRequest
};