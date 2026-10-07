const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ""
    },
    image_url: {
        type:String,
        required:[true,"image url is required for creating post "] 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "user Id is required for creating a post " ]
    }
})

const postModel = mongoose.model("post", postSchema)

module.exports = postModel