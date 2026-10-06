const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")


async function followUserController(req, res){
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    if(followeeUsername === followerUsername){
        return res.status(200).json({
            message:"you can not follow yourself"
        })
    }

    const isAlreadyFollowing = await userModel.findOne({
        follower: followeeUsername,
        followee:followeeUsername
    })

    if(isAlreadyFollowing){
        return res.status(200).json({
            message:`you are already following ${followeeUsername}`,
            follow: isAlreadyFollowing
        })
    }

    const isFolloweExists = await userModel.findOne({
        username: followeeUsername
    })

    if(!isFolloweExists){
        return res.status(404).json({
            message:"user you are trying to follow is not exists"
        })
    }

    const  followRecord = await userModel.create({
        follower:followerUsername,
        followee : followeeUsername
    })

    res.status(201).json({
        message:`you are now following ${followeeUsername}`,
        follow:followRecord
    })


}

module.exports = {
    followUserController
}