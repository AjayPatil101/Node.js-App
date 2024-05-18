const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: "",
    },
    username: {
        type: String,
        trim: true,
        default: "",
    },
    lastName: {
        type: String,
        trim: true,
        default: "",
    },
    email: {
        type: String,
        index: {
            unique: true,
            sparse: true,
        },
        lowercase: true,
        trim: true,
        verified: false,
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 20,
    },
    salt: {
        type: String,
    },

    roles: {
        type: [
            {
                type: String,
                enum: ["user"],
            },
        ],
        default: ["user"],
        required: "Please provide at least one role",
    },
    Phone: {
        type: String,
        required: true,
    },
    updated: {
        type: Date,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    // resetPasswordToken: {
    //     type: String,
    // },
    // resetPasswordExpires: {
    //     type: Date,
    // },
    resetOTP: {
        type: String,
    },
    resetOTPExpires:{
        type: Date,
    },
    /* For getting deviceToken on signup/signin api*/
    deviceTokens: {
        type: Array,
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
    profileImageURL: {
        type: String,
        default: 'https://s3.amazonaws.com/assets.glowingbud.com/user-profile-placeholder.png',
    },
});

module.exports = mongoose.model("User", UserSchema, "user");
