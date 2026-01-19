const Listing = require("../models/listing.js");              
const Review = require("../models/review.js");

// POST REVIEW ROUTE (POST) -> CREATE A NEW REVIEW
module.exports.createReview = async(req,res) => {
    let {id} = req.params;                              // extract id of the listing
    let listing = await Listing.findById(id);           // find the listing
    let newReview = new Review(req.body.review);        // create a new review from the info sent in req.body
    newReview.author = req.user._id;                    // add author

    listing.reviews.push(newReview);                    // add the reference of review id to the listing's "reviews" array
    await newReview.save();                             // save newReview
    await listing.save();                               // save listings as it has been updated by adding review id
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${id}`);                    // redirect to the show listing route
};

// DELETE REVIEW ROUTE (DELETE) -> DELETE A REVIEW
// two things to handle -> 1. remove review from listing when review is deleted (this is handeled here)
//                         2. delete reviews associated with the listing when listing is deleted (handeled using mongoose post middleware in listing.js)
module.exports.destroyReview = async (req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});      // takes care of #1 from above
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};