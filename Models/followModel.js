const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = new Schema({
    followerUserId:{
        type: Schema.Types.ObjectId,
        require:true,
        ref:"user"
    },
    followingUserId:{
        type: Schema.Types.ObjectId,
        require:true,
        ref:"user"
    },
    creationDateTime: {
        type: Date,
        required: true,
      }
})

module.exports = mongoose.model("follow", followSchema)