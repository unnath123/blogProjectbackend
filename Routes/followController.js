const express = require("express");
const { followUser, followList, unfollowUser } = require("../Functions/FollowFuncs");
const User = require("../class/userClass");
const followModel = require("../Models/followModel");
const { isAuth } = require("../Middlewares/isAuth");
const { ratelimit } = require("../Middlewares/rateLimiting");
const followRoute = express.Router();


followRoute.post("/follow-user", ratelimit , async(req, res)=>{
    //console.log(req.session)
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

followRoute.get("/follow-list", async(req, res)=>{
    const userID = req.session.user.userId
    console.log(userID)
    const SKIP = Number(req.query.skip) || 0
    try{
        const followlist = await followList(userID,SKIP)
        if(followlist.length == 0) {
            return res.send({
                status:200,
                message:"no followers found"
            })
        }
        return res.send({
            status:200,
            message:"followers list",
            follow_list: followlist
        })
    }
    catch(err){
        return res.send({
            status:400,
            error:"this is the error",
            message:err
        })
    }
})

followRoute.delete("/unfollow", async(req, res)=>{
    const followingUserId = req.body.followingUserId;
    const followerUserId = req.session.user.userId ;

    try{
        await User.verifyUser({userId: followingUserId})
        await User.verifyUser({userId: followerUserId})
    }
    catch(err){
        return res.send({
            status:400,
            message:"user ID not valid",
            error:err
        })
    }

    try{
        const unfollowDB = await unfollowUser(followerUserId, followingUserId)
        return res.send({
            status:200,
            message:"Unfollowed successfully",
            data:unfollowDB
        })
    }
    catch(err){
        return res.send({
            status:500,
            message:"couldnt unfollow"
        })
    }
})

module.exports = followRoute