const express = require("express");
// import { engine } from "express-handlebars";

// const engine = require("express-handlebars");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("./config/keys");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// load User model
require("./models/user");

// passport config
require("./config/passport")(passport);

// load routes
const index = require("./routes/index");
const auth = require("./routes/auth");

// map global promises
mongoose.Promise = global.Promise;

// mongoose connect
mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err.message));

const app = express();

// middleware
app.set("view engine", "handlebars");
app.engine("handlebars", exphbs.engine());

app.use(cookieParser());
// express-session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// use routes
app.use("/", index);
app.use("/auth", auth);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
