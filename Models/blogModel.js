const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title:{
        type:String,
        required: true,
        minLength: 2,
        maxLength: 100,
        trim: true,
    },
    textBody: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 1000,
        trim: true,
      },
      creationDateTime: {
        type: String,
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId, //fk to user
        required: true,
        ref: "user",
      },
      isDeleted:{
        type:Boolean,
        default:false,
        required:true,
      },
      deletionTime:{
        type:Date,
        required:false
      }
})

module.exports = mongoose.model("blog", blogSchema)