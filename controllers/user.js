const User = require("../models/user.js");

// signup form - GET -> serve the form
module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
};

// signup - POST -> save the user info in DB
// User.register saves the user in DB
module.exports.signup = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);  // instead of User.save()

        req.login(registeredUser, (err) => {    // login after signup                 // req.logout is a inbuilt method of passport to implement logout functionality
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// login form - GET -> serve the form
module.exports.renderSigninForm = (req,res) => {
    res.render("users/login.ejs");
};

// login - POST 
module.exports.login = async(req,res) => {  
    req.flash("success","Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";        // if the redirectUrl is empty then it will redirect to /listings
    res.redirect(redirectUrl);              // redirect back to the url that has required login
}

// logout
module.exports.logout = (req,res,next) => {
    req.logout((err) => {                   // req.logout is a inbuilt method of passport to implement logout functionality
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};