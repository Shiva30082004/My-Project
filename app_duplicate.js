// FOR MY KNOWLEDGE NOTHING TO DO WITH THE PROJECT

// THIS IS A DUPLICATE FILE OF APP.JS BEFORE FORMATTING IT

// const express = require("express");
// const app = express();
// const path = require("path");
// const methodOverride = require("method-override");
// const mongoose = require("mongoose");
// const ejsMate = require("ejs-mate");                // npm package to use layouts

// const wrapAsync = require("./utils/wrapAsync.js");          // REQUIRE THE WRAPASYNC FUNCTION
// const ExpressError = require("./utils/ExpressError.js");    // REQUIRE THE EXPRESSERROR CLASS

// const {listingSchema} = require("./schema.js");             // REQUIRE THE VALIDATION SCHEMA
// const {reviewSchema} = require("./schema.js");


// // MONGO DB connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// main().then(() => {
//     console.log("connected to DB");
// }).catch(err => console.log(err));
// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// app.set("view engine", "ejs");
// app.set("views",path.join(__dirname,"views"));

// app.use(express.static(path.join(__dirname,"public")));
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("_method"));

// app.engine("ejs",ejsMate);              // layouts

// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");

// // SCHEMA VALIDATION FUNCTION
// const validateListing = (req, res, next) => {
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(", ");      // join multiple errors
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }
// }

// const validateReview = (req,res,next) => {
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(", ");
//         throw new ExpressError(400,errMsg);
//     }
//     else{
//         next();
//     }
// }

// // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=

// // checking the database is working or not.....IMP after creating the Schema
// /*
// app.get("/testListing", async (req,res)=>{
//     let sample = new Listing({
//         title: "beach town",
//         description: "A beautiful villa located on the beach",
//         price: 2500,
//         location: "Goa",
//         country: "India",
//     });
//     let s = await sample.save();
//     console.log("working");
//     res.send(s);
// });
// */

// app.get("/",(req,res)=>{
//     res.send("HOME");
// });

// // 1. INDEX ROUTE (GET) -> SHOWS ALL LISTINGS
// app.get("/listings", wrapAsync(async(req,res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// }));

// // 3. NEW & CREATE ROUTE (GET + POST) -> CREATE NEW LISTING
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs");
// });
// app.post("/listings", validateListing, wrapAsync(async(req,res,next)=>{
//     // the way to get the fields from the form is different but we can use our traditional way
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();  
//     res.redirect("/listings"); 
// }));

// // 2. SHOW ROUTE (GET) -> SHOW A LISTING
// app.get("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     const requested_listing = await Listing.findById(id).populate("reviews");        // populate is added here so that reviews can be displayed
//     res.render("listings/show.ejs",{requested_listing});
// }));

// // 4. EDIT & UPDATE ROUTE (GET + PUT) -> EDIT A LISTING
// app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
// }));

// // deconstructor used here please refer..........
// app.put("/listings/:id", validateListing, wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});     // deconstruct the "req.body.listing" object and store each element individually
//     res.redirect(`/listings/${id}`);            // redirected to show route  
// }));

// // 5. DELETE ROUTE (DELETE) -> DELETE A LISTING
// app.delete("/listings/:id", wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }));

// // =-=-=-=-=- REVIEWS =-=-=-=-=-=
// // POST REVIEW ROUTE (POST) -> CREATE A NEW REVIEW
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res) => {
//     let {id} = req.params;                              // extract id of the listing
//     let listing = await Listing.findById(id);           // find the listing
//     let newReview = new Review(req.body.review);        // create a new review from the info sent in req.body
//     listing.reviews.push(newReview);                    // add the reference of review id to the listing's "reviews" array
//     await newReview.save();                             // save newReview
//     await listing.save();                               // save listings as it has been updated by adding review id

//     res.redirect(`/listings/${id}`);                    // redirect to the show listing route
// }));

// // DELETE REVIEW ROUTE (DELETE) -> DELETE A REVIEW
// // two things to handle -> 1. remove review from listing when review is deleted (this is handeled here)
// //                         2. delete reviews associated with the listing when listing is deleted (handeled using mongoose post middleware in listing.js)
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res) => {
//     let {id, reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});      // takes care of #1 from above
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }));

// // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=
// // ERROR HANDLING
// // REQUIRE FILES FROM UTILS
// // - ADD ASYNC WRAP TO ALL ASYNC FUNCTIONS

// // ROUTE TO HANDLE ALL THE ROUTES THAT ARE INVALID
// app.use((req,res,next)=>{
//     next(new ExpressError(404,"PAGE NOT FOUND"));
// });

// // #. ERROR HANDLING MIDDLEWARE         
// app.use((err,req,res,next) => {
//     let {statusCode=500,message="something went wrong"} = err;
//     res.status(statusCode).render("error.ejs", {message});              // render the error.ejs to display error page
// });

// // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=

// app.listen(8080,()=>{
//     console.log("server is listening on port 8080");
// });









// // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=
// // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=
// // ERROR HANDLING AND MIDDLEWARE NOTES:

// // Client-side validation – add required to all the fields, make form “novalidate” and add ‘class=” needs-validation”’
// // Create ExpressError file for ExpressError class and wrapAsync file wrapAsync function.
// // Require both of them in app.js
// // Use ExpreeError class where you want to throw new error
// // Use wrapAsync for each async function call.
// // Create a MW to handle all invalid route requests
// // Creat a MAIN error handling MW that renders the error.js file
// // Server-side validation – create a schemaValidation file that has Joi schema for validation
// // Require it in the app.js
// // Make a function to validate the schema and use it in API calls where we are creating or editing the schema/listing.

// // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=
// // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=