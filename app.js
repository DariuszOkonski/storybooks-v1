const express = require("express");
const path = require("path");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const keys = require("./config/keys");
const methodOverride = require("method-override");

// handlebars helpers
const {
  truncate,
  stripTags,
  truncateAndStripTags,
  formatDate,
  select,
  editIcon,
} = require("./helpers/hbs");

// Load Models
require("./models/user");
require("./models/story");

// passport config
require("./config/passport")(passport);

// load routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const stories = require("./routes/stories");

// map global promises
mongoose.Promise = global.Promise;

// mongoose connect
mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err.message));

const app = express();

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method override
app.use(methodOverride("_method"));

// middleware
app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  exphbs.engine({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      truncateAndStripTags: truncateAndStripTags,
      formatDate: formatDate,
      select: select,
      editIcon: editIcon,
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

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

//set static folder
app.use(express.static(path.join(__dirname, "public")));

// use routes
app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});
