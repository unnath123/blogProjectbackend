const followModel = require("../Models/followModel")
const { findOneAndDelete } = require("../Models/userModel")

const followUser = ({followerUserId, followingUserId}) =>{
    return new Promise(async(resolve, reject)=>{
        if(!followerUserId || !followingUserId) reject("both fields required")

        try{
            const fluser = await followModel.findOne({followerUserId, followingUserId})
            if(fluser) return reject("You are already following the user");

            const flobj = new followModel({
                followerUserId,
                followingUserId,
                creationDateTime: Date.now()
            })

            const followDB = await flobj.save();
            resolve(followDB);
        }
        catch(err){
          reject(err)
        }
    })
    
}

const followList = (userId, SKIP) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            const follow_List = await followModel.aggregate([
                {
                    $match:{followerUserId: userId}
                },
                {
                    $facet:{
                        data:[{$skip:SKIP},{$limit:5}]
                    }
                }
            ])
            if(!follow_List) return reject("not following anyone");

            resolve(follow_List[0].data)

        }
        catch(err){
            reject(err)
        }
    })
}

const unfollowUser = (followerUserId, followingUserId) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            const unflDb = await followModel.findOneAndDelete({followerUserId, followingUserId})
            resolve(unflDb)
        }
        catch(err){ 
            reject(err)
        }
    })
}

module.exports = {followUser, followList, unfollowUser}