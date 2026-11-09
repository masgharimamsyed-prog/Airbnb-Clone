if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require('express');
const path = require("path");
var methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

//DNS
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);


// ROUTER
const listingRoute = require("./routes/listings.js");
const ReviewRoute = require("./routes/review.js");
const UserRoute = require("./routes/user.js");
//APP
const flash = require('connect-flash');
const app = express();
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));


//sessions and cookies
const cookieParser = require('cookie-parser');
const session = require('express-session');

//Session storage
const MongoStore = require("connect-mongo").default;

app.use(cookieParser());
app.use(session({
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
  store: MongoStore.create({
    mongoUrl: process.env.ATLASMD,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60,
  })
}));
app.use(flash());



//PASSPORT
let passport = require("passport");
let LocalStrategy = require("passport-local");
let User = require("./models/User.js");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//OTHER UTILITIES
const ExpressError = require('./utilities/ExpressError.js');
const wrapAsync = require('./utilities/wrapAsync.js');
const { url } = require('inspector');



//RES.LOCAL MIDDLEWARE
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.currUser = req.user;
  next();
})

// ROUTE 
app.use("/listings", listingRoute);
app.use("/listings/:id", ReviewRoute);
app.use("/user", UserRoute);

//ROOT path
app.get("/", (req, res) => {
  res.render("root.ejs");
});

//ERROR HANDLING MIDDLE WARE FOR ALL
app.use((err, req, res, next) => {
  let { statusCode = 403, message = "default: Something went wrong" } = err;
  req.flash("failure", `${message}`);
  res.redirect("/listings");
})


if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}

module.exports = app;