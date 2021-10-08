const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserNotification = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: Number,
    default: 0,//1:Like 2:Comment 3:Tags
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("UserNotification", UserNotification);
