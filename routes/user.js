const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const userControllers=require("../Controllers/userControllers.js");


//MIDDLEWARES
const { redirectURL } = require("../middlewares/redirectURL.js");

//SIGNUP FORM
router.route("/signup")
.get((req, res) => {
    res.render("Users/signup.ejs");
})
.post( redirectURL,userControllers.FormToImplementation);

//LOGIN FORM
router.route("/login")
.get((req, res) => {
    res.render("Users/login.ejs");
})
.post( redirectURL, passport.authenticate('local', { failureRedirect: "/user/login", failureFlash: true, failureFlash: { type: "failure" } }),userControllers.loginFormtoWeb )


//LOGOUT 
router.get("/logout", redirectURL,userControllers.logOut );


module.exports = router;