const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },    
    reviews: [              // ARRAY OF REFERENCE ID's TO REVIEW DOCUMENT
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // https://mongoosejs.com/docs/geojson.html
    geometry: {     // this is a geojson type of mongoose to strore coordinates
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },
    
});


// MONGOOSE MIDDLEWARE (POST) THAT DELETES THE REVIEW ASSOCIATED WITH A LISTING WHEN A LISTING IS DELETED
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing.reviews.length){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;

// when we create a review model, it is a simple model
// all linking(relationships) is done here in listing.js 
// 1. require Review model
// 2. adding reviews array, which is array of review onject id
// 3. writing a DELETE ON CASCADE functionality


/* IMAGE FIELD BEFORE....
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1694967832949-09984640b143?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1694967832949-09984640b143?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        // tertnary operator and default image link
    }
*/