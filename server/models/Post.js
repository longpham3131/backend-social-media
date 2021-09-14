const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["1", "2", "3"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("post", PostSchema);
