
const postModel = require('../models/post.model')
const ImageKit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs')
const userModel = require('../models/user.model')
const likeModel = require("../models/likes.model")


const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req, res) {

    console.log(req.body, req.file)

    const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: "test",
        folder: "insta-clone-posts"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        image_url: file.url,
        user: req.user.id
    })

    res.status(201).json({
        message: "post created successfully",
        post
    })

}

async function getPostController(req, res) {

    const userId = req.user.id

    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message: "posts fetched successfully",
        posts
    })
}

async function getPostDetailsController(req, res) {

    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "post not found"
        })
    }

    const isValidUser = post.user.toString() === userId

    if (!isValidUser) {
        return res.status(403).json({
            message: "forbidden content"
        })
    }

    return res.status(200).json({
        message: "post fetched successfully",
        post
    })
}

async function likePostController(req, res){
    const  username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if(!post){
        return res.status(404).json({
            message:"post not found "
        })
    }

    const likes = await likeModel.create({
        user:username,
        post:postId,

    })

    res.status(201).json({
        message:"post liked successfully",
        likes
    })
}

module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController
}
