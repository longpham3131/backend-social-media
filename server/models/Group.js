const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Group = new Schema({
  createBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  updateBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  isPrivate: {
    type: Schema.Types.Boolean,
    default: true
  },
  groupName: {
    type: String,
    required: true,
    default: ''
  },
  groupDescription: {
    type: String,
    default: ''
  },
  cover: {
    type: String,
    default: ''
  },
  adminGroup: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  members: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "RoleGroup",
    },
  }],
  requestJoin: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],
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

module.exports = mongoose.model("Group", Group);
