const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const AuthenticateCode = new Schema({
  email: {
    type: String,
    default:"",
    required:true
  },
  code: {
    type:String,
    default:"",
    required:true
  },
  createAt: {
    type: Date,
    default: Date.now,
    index: true   
  },
  expireAt: {
    type: Date,
    default:moment().add(30,'minutes'),
    index: true   
  },
});
module.exports = mongoose.model("AuthenticateCode", AuthenticateCode);
