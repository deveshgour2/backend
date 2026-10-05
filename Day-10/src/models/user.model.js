const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already registered"],
        required: [true, "username is required"]
    },

    email: {
        type: String,
        unique: [true, 'email is already registered'],
        required: [true, 'email is required']
    },

    password: {
        type: String,
        required: [true, 'password must be require']
    },

    bio: {
        type: String,
        default: ""
    },
    profile_image: {
        type: String,
        default: "https://ik.imagekit.io/vvxgcus14/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.webp"
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users"
    }]
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel