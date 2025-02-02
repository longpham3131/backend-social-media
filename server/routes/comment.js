const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/comment");
const UserNotification = require("../models/UserNotification");
const { ObjectId } = require("mongodb");
const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();
const SingleFile = require("../models/SingleFile");
const {
  singleFileUpload,
  multipleFileUpload,
  getAllFiles,
  getAllMultiFiles,
} = require("../controllers/upload");
const { error500, error400 } = require("../util/res");
const comment = require("../models/comment");
router.get("/", verifyToken, async (req, res) => {
  try {
    const { postId, index, pageSize } = req.query;
    console.log(postId, index, pageSize);
    let post = await Post.findById(postId)
      .select("comments")
      .populate({
        path: "comments",
        options: {
          skip: pageSize * index,
          perDocumentLimit: pageSize,
        },
        populate: [
          {
            path: "user",
            select: "username fullName avatar like",
          },
          {
            path: "like.user",
            select: "username fullName avatar like",
          },
          {
            path: "file",
          },
        ],
      })
      .lean();
    return res.json({ success: true, data: post });
  } catch (err) {
    console.log(err);
    error500(res);
    s;
  }
});

router.post("/likeComment", verifyToken, async (req, res) => {
  try {
    const { commentId, type, postId } = req.body;
    const io = req.io;
    let userForNoti = await User.findById(req.userId).select("fullName avatar");
    let commentFound = await comment.findById(commentId);
    commentFound.like = commentFound.like.filter((e) => {
      return e.user.toString() != req.userId;
    });

    if (type == 1) {
      commentFound.like.push({ user: ObjectId(req.userId) });
    }

    let queryData = {
      user: commentFound.user,
      type: 4,
      postId: postId,
      fromUser: ObjectId(req.userId),
    };
    await UserNotification.findByIdAndDelete(queryData);
    const noti = await UserNotification(queryData);
    await noti.save();
    await commentFound.save();
    if (type == 1) {
      io.sockets
        .to(`user_${commentFound.user.toString()}`)
        .emit("notification", {
          data: { ...queryData, fromUser: userForNoti },
        });
    } else {
      io.sockets
        .to(`user_${commentFound.user.toString()}`)
        .emit("notification", {
          data: { ...queryData, fromUser: userForNoti, type: -4 },
        });
    }
    return res.json({
      success: true,
      data: commentFound.like[commentFound.like.length - 1],
    });
  } catch (err) {
    console.log(err);
    error500(res);
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      postId = null,
      content,
      file = null,
      parentComment = null,
    } = req.body;

    let userForNoti = await User.findById(req.userId).select("fullName avatar");
    let newFile = null;
    if (file[0]) {
      newFile = new SingleFile({
        fileName: file[0].name,
        filePath: file[0].file,
        fileType: file[0].type,
        fileSize: file[0].size, // 0.00
        type: "comment",
        user: req.userId,
      });
      await newFile.save();
    }

    const comment = new Comment({
      user: ObjectId(req.userId),
      content,
      file: newFile,
      parentComment,
    });
    let rs = await Promise.all([comment.save(), Post.findById(postId)]);
    rs[1].comments = [comment._id, ...rs[1].comments];
    await rs[1].save();
    let queryData = {
      user: rs[1].poster,
      type: parentComment == null ? 2 : 5,
      postId: postId,
      fromUser: req.userId,
    };
    // await UserNotification.findByIdAndDelete(queryData);

    if (req.userId !== rs[1].poster.toString()) {
      const noti = await UserNotification(queryData);
      await noti.save();
      const io = req.io;
      console.log(`user_${rs[1].poster.toString()}`);
      io.sockets.to(`user_${rs[1].poster.toString()}`).emit("notification", {
        fromUser: userForNoti,
        type: 1,
        postId,
        mess: "commented your post",
      });
    }
    res.json({ success: true, data: rs[0], message: "true" });
  } catch (err) {
    console.log(err);
    error500(res);
  }
});
router.put("/", verifyToken, async (req, res) => {
  try {
    const { commentId, content, file = null } = req.body;
    let data = {
      content,
      file,
    };
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "undefined") delete data[key];
    }
    let comment = await Comment.findByIdAndUpdate(commentId, data, {
      new: true,
    });

    res.json({ success: true, data: comment, message: "true" });
  } catch (err) {
    error500(res);
  }
});

router.post("/commentDelete", verifyToken, async (req, res) => {
  try {
    const { commentId, postId } = req.body;
    const result = await Promise.all([
      Post.findById(postId),
      Comment.findByIdAndDelete(commentId),
    ]);
    result[0].comments = result[0].comments.filter(
      (e) => e.toString() !== commentId
    );
    await result[0].save();

    await UserNotification.findOneAndDelete({
      user: result[0].poster,
      postId: result[0]._id,
      fromUser: ObjectId(req.userId),
      type: 2,
    });

    const io = req.io;

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
