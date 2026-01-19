// controllers contains all the async functions making the router file clean and readable
// following the MVC framework(style of writing code)

const Listing = require("../models/listing.js");

// map - MAPBOX
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');    // mapbox package - npm install @mapbox/mapbox-sdk
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// 1. INDEX ROUTE (GET) -> SHOWS ALL LISTINGS
module.exports.index = async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

// 3. NEW & CREATE ROUTE (GET + POST) -> CREATE NEW LISTING
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing = async(req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()

    // exptract image url & filename
    let url = req.file.path;
    let filename = req.file.filename;

    // the way to get the fields from the form is different but we can use our traditional way
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;        // add the current logged in user as a owner
    newListing.image = {url,filename};      // add the image details
    newListing.geometry = response.body.features[0].geometry;   // extracting location coordinates
    let savedListing = await newListing.save();  
    req.flash("success", "New Listing Created");    // flash msg
    res.redirect("/listings"); 
};

// 2. SHOW ROUTE (GET) -> SHOW A LISTING
module.exports.showListing = async(req,res)=>{
    let {id} = req.params;

    // custom populate to display the author of the review (nested-populate)
    const requested_listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");        // populate is added here so that reviews can be displayed
    if(!requested_listing){                                         // flash message if listing doesn't exist
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");                                   // return is imp
    }
    res.render("listings/show.ejs",{requested_listing});
};

// 4. EDIT & UPDATE ROUTE (GET + PUT) -> EDIT A LISTING
module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    // flash msg for listing not exist
    if(!listing){                                         
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");                                   // return is imp
    }

    // decrease the image pixel which will be displayed on edit form(edit.ejs)
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

// deconstructor used here please refer..........
module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});     // deconstruct the "req.body.listing" object and store each element individually

    if(typeof req.file !== "undefined"){                       // if new image is uploaded
        // exptract image url & filename
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);            // redirected to show route  
};

// 5. DELETE ROUTE (DELETE) -> DELETE A LISTING
module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};