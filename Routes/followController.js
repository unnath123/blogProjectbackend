const express = require("express");
const { followUser } = require("../Functions/FollowFuncs");
const User = require("../class/userClass");
const { Error } = require("mongoose");
const followRoute = express.Router();


followRoute.post("/follow-user", async(req, res)=>{
    console.log(req.session)
    const followerUserId = req.session.user.userId;
    const {followingUserId} = req.body;

    if(followerUserId.toString() === followingUserId.toString()){
        return res.send({
            status:400,
            message:"request cannot be processed"
        })
    }


    try{
        await User.verifyUser({userId: followerUserId})
        await User.verifyUser({userId:followingUserId})
        const follow = await followUser({followerUserId,followingUserId})
        if(!follow){
            return res.send({
                status:400,
                message:"couldnt process the request"
            })
        }
        return res.send({
            status:201,
            message:"User successfully followed"
        })
    }
    catch(err){
        return res.send({
            status:400,
            message:err
        })
    }
})

module.exports = followRoute