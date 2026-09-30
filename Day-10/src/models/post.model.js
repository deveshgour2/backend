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
    userId: {
        type: String,
        ref: mongoose.Schema.Types.ObjectId,
        required: [true, "userId is required"]
    }
})

const postModel = mongoose.model("post", postSchema)

module.exports = postModel