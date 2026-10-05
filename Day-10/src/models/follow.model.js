const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    followers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, " Followers is required"]
    },

    followee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "Folowee is required"]
    }
}, {
    timestamps: true
})

const followModel = mongoose.Schema("follows", followSchema)

module.exports = followModel