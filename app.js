// npm i dotenv -> a npm package for using env variables
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");                        // npm package to use layouts
const session = require("express-session");                 // express sessions
const flash = require("connect-flash");                     // flash message
const MongoStore = require('connect-mongo').default;                // npm i mongo-store (https://www.npmjs.com/package/connect-mongo)

const passport = require("passport");                       // passport npm package for authentication 
const LocalStrategy = require("passport-local");            // passport-local npm package for signup/login using username-pwd
const User = require("./models/user.js");                   // to use in passport else we don't need it here

const ExpressError = require("./utils/ExpressError.js");    // REQUIRE THE EXPRESSERROR CLASS

// MONGO DB connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main().then(() => {
    console.log("connected to DB");
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);              // layouts

const store = MongoStore.create({       // to store session related info on cloud DB (ATLASDB)
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", () => {   // to handle error from mongo session store
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {                // session options                        
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() +  7*24*60*60*1000,     // delete after 7 days
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));             // session MW

app.use(flash());                             // flash MW

// configuring stratergy -> PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
app.use((req,res,next) => {                     // MW for flash msg, basically a MW to define locals to us them in ejs files
    res.locals.success = req.flash("success");      // used in flash.ejs
    res.locals.error = req.flash("error");          // used in flash.ejs
    res.locals.currUser = req.user;
    next();
});

// Express router
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

// moved to routes folder under restructuring (NO LONGER NEEDED HERE IN APP.JS)

// const wrapAsync = require("./utils/wrapAsync.js");          // REQUIRE THE WRAPASYNC FUNCTION
// const {listingSchema} = require("./schema.js");             // REQUIRE THE VALIDATION SCHEMA
// const {reviewSchema} = require("./schema.js");

// Models
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");

// SCHEMA VALIDATION FUNCTION

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=

// checking the database is working or not.....IMP after creating the Schema
/*
app.get("/testListing", async (req,res)=>{
    let sample = new Listing({
        title: "beach town",
        description: "A beautiful villa located on the beach",
        price: 2500,
        location: "Goa",
        country: "India",
    });
    let s = await sample.save();
    console.log("working");
    res.send(s);
});
*/

// app.get("/",(req,res)=>{
//     res.send("HOME");
// });


// DEMO USER
// app.get("/demouser", async(req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registerUser = await User.register(fakeUser, "helloWorld");         // helloWorld is the pswd
//     res.send(registerUser);
// });

// =-=-=-=-=- LISTINGS =-=-=-=-=-=
// Restructed the app.js by moving all api routes related to listing in router->listing.js
app.use("/listings",listingsRouter);

// =-=-=-=-=- REVIEWS =-=-=-=-=-=
// Restructed the app.js by moving all api routes related to review in router->review.js
app.use("/listings/:id/reviews", reviewsRouter);

// =-=-=-=-=- USERS =-=-=-=-=-=
app.use("/", usersRouter);

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=
// ERROR HANDLING
// - REQUIRE FILES FROM UTILS
// - ADD ASYNC WRAP TO ALL ASYNC FUNCTIONS

// ROUTE TO HANDLE ALL THE ROUTES THAT ARE INVALID
app.use((req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND"));
});

// #. ERROR HANDLING MIDDLEWARE --> MAIN ONE       
app.use((err,req,res,next) => {
    let {statusCode=500,message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});              // render the error.ejs to display error page
});

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});









// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=
// ERROR HANDLING AND MIDDLEWARE NOTES:

// Client-side validation – add required to all the fields, make form “novalidate” and add ‘class=” needs-validation”’
// Create ExpressError file for ExpressError class and wrapAsync file wrapAsync function.
// Require both of them in app.js
// Use ExpreeError class where you want to throw new error
// Use wrapAsync for each async function call.
// Create a MW to handle all invalid route requests
// Creat a MAIN error handling MW that renders the error.js file
// Server-side validation – create a schemaValidation file that has Joi schema for validation
// Require it in the app.js
// Make a function to validate the schema and use it in API calls where we are creating or editing the schema/listing.

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=