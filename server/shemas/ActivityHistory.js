const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = require("../models/Post");
const ActivityHistory = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  strDate: {
    type: String,
    default: "",
  },
  createAt: {
    type: Date,
    default: Date.now,
    unique: true,
    index: true,
  },
});

module.exports = mongoose.model("ActivityHistory", ActivityHistory);
