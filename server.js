// Imports
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');

// Setting up MongoDB Atlas Port
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(cors({
  origin: "http://localhost:3000", // React Frontend  port,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.role;

// Opening connection to MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
  initial();
  checkSlots();
  checkBan();
})
  .catch(err => {
    console.error("Connection Error", err);
    process.exit();
  });

// Opening Connection to GymWorm_bot
const TOKEN = process.env.TOKEN;
const SERVER_URL = process.env.SERVER_URL;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;
const { botRequest } = require("./middlewares");

//console.log(WEBHOOK_URL); // test
//console.log(TELEGRAM_API);

// for Initializing connection to GymWorm_bot
const botInit = async () => {
  const result = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  //console.log(result.data);
}

// GymWorm_bot functions
app.post(URI, async (req, res) => {
  console.log(req.body);
  const chatID = req.body.message.chat.id;
  const teleID = req.body.message.chat.username;
  console.log(req.body.text);
  
  if (req.body.text === /\/bookmark/) {
    console.log("matched")
    await botRequest.teleRequest({ chatID: chatID, telegramHandle: teleID });
  } else {
    console.log("no match");
  }
  return res.send();
})

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

// Initialize Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/slot.routes')(app);

// Auto Daily Slot Creation
const { autoSlots } = require("./middlewares");
const { checkBans } = require("./middlewares");

function checkSlots() {
  console.log("Slot Generation Request Dates : ");

  // Checking today's date
  let date = new Date();
  let nowDate = new Date(date);
  nowDate.setHours(8, 0, 0, 0);
  console.log("Time now is ");
  console.log(nowDate);
  autoSlots.generateSlots({ date: nowDate });

  // Checking tomorrow's date
  let nextDate = new Date(date);
  nextDate.setHours(32, 0, 0, 0);
  console.log("Time tomorrow is ");
  console.log(nextDate);
  autoSlots.generateSlots({ date: nextDate });

  // Checking next day's date
  let nextDayDate = new Date(date);
  nextDayDate.setHours(56, 0, 0, 0);
  console.log("Time next day is ");
  console.log(nextDayDate);
  autoSlots.generateSlots({ date: nextDayDate });
}

// Auto Daily Slot Creation
const cron = require('node-cron');
cron.schedule("0 0 * * *", function () {
  console.log("Daily Scheduled Running");
  checkSlots();
  checkBan();
});

function checkBan() {
  console.log("Check Bans Request");
  checkBans.checkAll();
}

// Error handling, disable for now
/*app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})*/

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send("API Running, Welcome to Gym Worm!");
  });
}

// Initialize Server
app.listen(PORT, async () => {
  console.log(`Server is running on port: ${PORT}`);
  await botInit();
});