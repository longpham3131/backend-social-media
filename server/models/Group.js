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
<<<<<<< HEAD
  },
  groupDescription: {
    type: String,
    default: ''
  },
  cover: {
    type: String,
    default: ''
  },
=======
  },
  groupDescription: {
    type: String,
    default: ''
  },
  cover: {
    type: String,
    default: '5f6d2f8173860-bp-cover-image_gw7shw.jpg'
  },
  avatar: {
    type: String,
    default: '166258_miyrwl.png'
  },
>>>>>>> refactor-FE
  adminGroup: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
<<<<<<< HEAD
=======
  tags: [{
    type: String
  }],
>>>>>>> refactor-FE
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
<<<<<<< HEAD
=======
  invited: [
    {
      member: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      invitedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    }
  ],
>>>>>>> refactor-FE
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
