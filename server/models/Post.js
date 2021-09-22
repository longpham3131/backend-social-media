const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
  },
  text: {
    type: String,
    default: "",
  },
  audience: {
    type: String,
    required: true,
  },
  poster: {
    type: Object,
    required: true,
    default: {
      userId: "",
      username: "",
      avatar: "",
      fullName: "",
    },
  },
  like: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  share: { type: Number, default: 0 },
  attachments: {
    type: Array,
    default: [],
  },
  postParent: { type: String, default: "" },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("post", PostSchema);
