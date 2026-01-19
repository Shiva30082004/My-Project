const express = require("express");
const router = express.Router({mergeParams: true});        // router

// CONTROLLER
const reviewController = require("../controllers/review.js");

const wrapAsync = require("../utils/wrapAsync.js");          // REQUIRE THE WRAPASYNC FUNCTION
const ExpressError = require("../utils/ExpressError.js");    // REQUIRE THE EXPRESSERROR CLASS
         
const {reviewSchema} = require("../schema.js");              // REQUIRE THE VALIDATION SCHEMA

const Listing = require("../models/listing.js");              
const Review = require("../models/review.js");               // MODEL

// SCHEMA VALIDATION FUNCTION - moved to middleware.js
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=

// POST REVIEW ROUTE (POST) -> CREATE A NEW REVIEW
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE REVIEW ROUTE (DELETE) -> DELETE A REVIEW
// two things to handle -> 1. remove review from listing when review is deleted (this is handeled here)
//                         2. delete reviews associated with the listing when listing is deleted (handeled using mongoose post middleware in listing.js)
// isLoggedIn, isReviewAuthor are MW that checks user is logged in and he is the author of review or not, bith exists in middleware.js
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=

module.exports = router;

