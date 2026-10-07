const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    post: {
        type: String,
        ref: "posts",
        required: [true, 'post id is required for creating likes']
    },

    user: {
        type: String,
        required: [true, 'user is required for creating a like']
    }
}, {
    timestamps: true
})

likeSchema.index({ post: 1, user: 1 }, { unique: true })

const likeModel = mongoose.model('likes',likeSchema)

module.exports = likeModel