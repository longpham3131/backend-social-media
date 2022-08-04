const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    default: ""
  },
  text: {
    type: String,
    default: "",
  },
  audience: {
    type: String,
    default: "public"
  },
  poster: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: Number,
    default: 1
  },
<<<<<<< HEAD
  isGroup:{
    type:Boolean,
    default:false
  },
  groupId:{
=======
  isGroup: {
    type: Boolean,
    default: false
  },
  groupId: {
>>>>>>> refactor-FE
    type: Schema.Types.ObjectId,
    ref: "Group",
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
<<<<<<< HEAD

=======
>>>>>>> refactor-FE
  share: { type: Number, default: 0 },
  attachments: [{
    type: Schema.Types.ObjectId,
    ref:"SingleFile"
  }],
  postParent: { type: String, default: "" },
  createAt: {
    type: Date,
    default: Date.now,
    unique: true,
    index: true
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: Array,
    default: []
  }
});
PostSchema.pre("remove", function () { });
PostSchema.pre("updateOne", function () {
  this.set({ updateAt: new Date() });
});
module.exports = mongoose.model("post", PostSchema);
