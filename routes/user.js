// PASSPORT -> https://www.passportjs.org/docs/
// IT IS USED IN models/user.js, routes/user.js, app.js
const express = require("express");
const router = express.Router();

// CONTROLLER
const userController = require("../controllers/user.js");

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=
// router.route -> https://expressjs.com/en/5x/api.html#router.route

router
    .route("/signup")
    .get(userController.renderSignupForm)          // signup form - GET -> serve the form
    .post(wrapAsync(userController.signup));   // signup - POST -> save the user info in DB

// login form - GET -> serve the form
// login - POST 
// passport.authenticate() authenticates that the username & password entered are correct
// passport.authenticate() does the login task for us (VERY IMP & HELPFUL)
router
    .route("/login")
    .get(userController.renderSigninForm)    
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.login);

// logout
router.get("/logout", userController.logout);

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=

module.exports = router;

// HERE IN USERS MODEL WE HAVE USED PASSPORT METHODS WHICH ARE VERY HELFUL
// SO PLEASE REFER THEM, THEY ARE VERY USEFUL AND IMP
// SOME ARE IN middleware.js AND SOME IN controllers/user.js 

/* BEFORE USING router.route
    // signup form - GET -> serve the form
    router.get("/signup", userController.renderSignupForm);

    // signup - POST -> save the user info in DB
    router.post("/signup", wrapAsync(userController.signup));

    // login form - GET -> serve the form
    router.get("/login", userController.renderSigninForm);

    // login - POST 
    // passport.authenticate() authenticates that the username & password entered are correct
    // passport.authenticate() does the login task for us (VERY IMP & HELPFUL)
    router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.login);

    // logout
    router.get("/logout", userController.logout);

*/