
const postModel = require('../models/post.model')
const ImageKit = require('@imagekit/nodejs')
const { toFile } = require('@imagekit/nodejs')
const jwt = require('jsonwebtoken')
const cookies = require("cookie-parser")
const userModel = require('../models/user.model')

const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req, res) {

    console.log(req.body, req.file)

    const token = req.cookies.token

    if (!token) {
        return res.satus(401).json({
            message: "token not provided, unauthorized access"
        })
    }

    let decoded = null

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            message: "user not authorized"
        })
    }

    console.log(decoded)

    const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: "test",
        folder: "insta-clone-posts"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        image_url: file.url,
        userId: decoded.id
    })

    res.status(201).json({
        message: "post created successfully",
        post
    })

}

module.exports = createPostController
