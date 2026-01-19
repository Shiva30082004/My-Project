const express = require("express");

// router
const router = express.Router();

// controller
const listingController = require("../controllers/listing.js");

// multer npm package - image files
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=
// require all important and required functions

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js"); 
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

// SCHEMA VALIDATION FUNCTION
const {validateListing} = require("../middleware.js");

// PASSPORT OR AUTHENTICATION OR AUTHORIZATION MWs
const {isLoggedIn, isOwner} = require("../middleware.js");       // middleware to check that the user is logged in

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=
// router.route -> https://expressjs.com/en/5x/api.html#router.route
router
    .route("/")
    .get(wrapAsync(listingController.index))        // 1. INDEX ROUTE (GET) -> SHOWS ALL LISTINGS
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));     // 3. CREATE ROUTE (POST) -> CREATE NEW LISTING
    // upload.single -> to upload image file

// 3. NEW & CREATE ROUTE (GET) -> CREATE NEW LISTING
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))   // 2. SHOW ROUTE (GET) -> SHOW A LISTING
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.editListing))    // 4. UPDATE ROUTE (PUT) -> EDIT A LISTING
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));  // 5. DELETE ROUTE (DELETE) -> DELETE A LISTING

// 4. EDIT & UPDATE ROUTE (GET + PUT) -> EDIT A LISTING
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=

module.exports = router;



/*  BEFORE USING router.route()   ->   GOOD FOR LEARNING PURPOSE

    // 1. INDEX ROUTE (GET) -> SHOWS ALL LISTINGS
    router.get("/", wrapAsync(listingController.index));

    // 3. NEW & CREATE ROUTE (GET + POST) -> CREATE NEW LISTING
    router.get("/new", isLoggedIn, listingController.renderNewForm);

    router.post("/", validateListing, isLoggedIn, wrapAsync(listingController.createListing));

    // 2. SHOW ROUTE (GET) -> SHOW A LISTING
    router.get("/:id",wrapAsync(listingController.showListing));

    // 4. EDIT & UPDATE ROUTE (GET + PUT) -> EDIT A LISTING
    router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

    router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(listingController.editListing));

    // 5. DELETE ROUTE (DELETE) -> DELETE A LISTING
    router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

*/