const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")


async function followUserController(req, res){
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    if(followeeUsername === followerUsername){
        return res.status(400).json({
            message:"you can not follow yourself"
        })
    }

    const isFolloweeExists = await userModel.findOne({
        username: followeeUsername
    })

    if(!isFolloweeExists){
        return res.status(404).json({
            message:"user you are trying to follow is not exists"
        })
    }

    
    const isAlreadyFollowing = await followModel.findOne({
        follower: followerUsername,
        followee:followeeUsername
    })

    if(isAlreadyFollowing){
        return res.status(200).json({
            message:`you are already following ${followeeUsername}`,
            follow: isAlreadyFollowing
        })
    }

    const status = isFolloweeExists.isPrivate ? 'pending' : 'accepted' 

    const  followRecord = await followModel.create({
        follower:followerUsername,
        followee : followeeUsername,
        status
    })

    if(status == "pending"){
        return res.status(201).json({
            message:`follow request sent to ${followeeUsername}`,
            follow:followRecord
        })
    }

    res.status(201).json({
        message:`you are now following ${followeeUsername}`,
        follow:followRecord
    })


}

async function unfollowUserController(req, res){
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })

    if(!isUserFollowing){
        return res.status(200).json({
            message:`you are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message:`you are unfollowed ${followeeUsername}`
    })
}

module.exports = {
    followUserController,
    unfollowUserController
}