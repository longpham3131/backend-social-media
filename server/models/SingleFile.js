const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const singleFileSchema = new Schema({
    fileName:{
        type:String,
        required:true
    },
    filePath:{
        type:String,
        required:true
    },
    fileType:{
        type:String,
        required:true
    },
    fileSize:{
        type:String,
        required:true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},{timestamps:true})


module.exports = mongoose.model("SingleFile", singleFileSchema);