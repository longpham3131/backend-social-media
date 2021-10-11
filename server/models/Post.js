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
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  like: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      createAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
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
PostSchema.pre("remove", function () {});
PostSchema.pre("updateOne", function () {
  this.set({ updateAt: new Date() });
});
module.exports = mongoose.model("post", PostSchema);
