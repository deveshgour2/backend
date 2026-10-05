const express = require("express")
const postController = require('../controllers/post.controller')
const multer = require("multer")
const identifyUser = require("../middlewares/auth.middleware")
const upload = multer({storage:multer.memoryStorage()})

const postRouter = express.Router()

postRouter.post('/',upload.single("image"), identifyUser ,postController.createPostController)

postRouter.get('/', identifyUser, postController.getPostController)

postRouter.get('/details/:postId', identifyUser, postController.getPostDetailsController)

module.exports = postRouter 