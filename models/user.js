const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

/* IMPORTANT
    You're free to define your User how you like. Passport-Local Mongoose will add a username, 
    hash and salt field to store the username, the hashed password and the salt value.
    Additionally, Passport-Local Mongoose adds some methods to your Schema
*/


const userSchema = new Schema({
    // username & password are defined automatically by pssport-local-mongoose
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);         // this line does the automatic defination of username & password

module.exports = mongoose.model("User", userSchema);
