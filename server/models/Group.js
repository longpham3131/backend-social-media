const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserFriend = new Schema({
  createBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  updateBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  targetId: {
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
//   members:{
//       type:Array<>,
//       default:[]
//   }
});

module.exports = mongoose.model("post", PostSchema);
