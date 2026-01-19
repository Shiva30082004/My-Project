const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

// SCHEMA VALIDATION FUNCTION(MW)
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");      // join multiple errors
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// if the user is not logged in then redirect to login page else call next()
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){ 
        req.session.redirectUrl = req.originalUrl;                  // store the url/path in sessions which has raised the login requirement
        req.flash("error", "you must be logged in to create a new listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// grant permission only to the listing owner (authorization)
module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you're not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// grant permission only to the review author (authorization)
module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "you're not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}