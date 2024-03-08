const followModel = require("../Models/followModel")

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

module.exports = {followUser}