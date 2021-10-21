const Post = require("../models/Post");
const Comment = require("../models/comment");
const UserNotification = require("../models/UserNotification");
const { ObjectId } = require("mongodb");
const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();
const {
  singleFileUpload,
  multipleFileUpload,
  getAllFiles,
  getAllMultiFiles,
} = require("../controllers/upload");
const { error500, error400 } = require("../util/res");
router.get("/", verifyToken, async (req, res) => {
  try {
    const { postId, index, pageSize } = req.query;
    console.log(postId, index, pageSize);
  } catch (err) {
    console.log(err);
    error500(res);
  }
});
module.exports = router;
router.post("/", verifyToken, async (req, res) => {
  try {
    const { postId, content, file = null, parentComment = null } = req.body;
    const comment = new Comment({
      content,
      file,
      parentComment,
    });
    const rs = await Promise.all([comment.save(), Post.findById(postId)]);
    rs[1].comments.push(comment._id);
    await rs[1].save();

    const noti = await UserNotification({
      user: rs[1].poster,
      type: 2,
      postId: postId,
      fromUser: req.userId,
    });
    await noti.save();
    io.sockets
      .to(`user_${rs[1].poster.toString()}`)
      .emit("notification", comment);
    res.json({ success: true, data: rs[0], message: "true" });
  } catch (err) {
    error500(res);
  }
});
router.put("/", verifyToken, async (req, res) => {
  try {
    const { commentId, content, file = null } = req.body;
    let data={
      content,
      file
    }
    for (const [key, value] of Object.entries(data)) {
     if(typeof value=== "undefined")
      delete data[key]
    }
    let comment = await Comment.findByIdAndUpdate(commentId,data,{
      new:true
    });
   
    res.json({ success: true, data: comment, message: "true" });
  } catch (err) {
    error500(res);
  }
});

router.delete("/", verifyToken, async (req, res) => {
  try {
    const { commentId,postId } = req.body;
    const result =await Promise.all([Post.findById(postId),Comment.findByIdAndDelete(commentId)]);
    result[0].comments= result[0].comments.filter(e=>e.toString()!==commentId)
    await result[0].save()

     await UserNotification.findOneAndDelete({
      user: result[0].poster,
      postId: result[0]._id,
      fromUser: ObjectId(req.userId),
      type: 2,
    });
    io.sockets
      .to(`user_${result[0].poster.toString()}`)
      .emit("notification", "you have new notification");
    res.json({ success: true, data: result, message: "true" });
  } catch (err) {
    console.log(err);
    error500(res);
  }
});
module.exports = router;
