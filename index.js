const express = require("express");
const mongoose = require("mongoose");
//require("dotenv").config();
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
require("./models/User");
require("./services/passport");
const authRoutes = require("./routes/authRoutes");
const billingRoutes = require("./routes/billingRoutes");

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Express will serve up production assets like main.js
app.use(express.static("./client/build/"));

authRoutes(app);
billingRoutes(app);

// Express will serve uo the index.html if route is not recognized
const path = require("path");
app.get("/*", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/client/build/" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`on server ${PORT}`);
});
