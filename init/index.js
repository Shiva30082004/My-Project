const mongoose = require("mongoose");

// MONGO DB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected to DB");
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}

const Listing = require("../models/listing.js");        // model
const initData = require("./data.js");                  // initial data - it is a object in which key="data" and value=array of data  

// async function
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '69628481caac9258c8d5ef25'}));
    await Listing.insertMany(initData.data);
    console.log("All Done, initial data loaded");
}

// call the function
initDB();
