const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const Post = require("../models/Post");
const Like = require("../models/Like");
const User = require("../models/User");
const UserNotification = require("../models/UserNotification");
const { error500, error400 } = require("../util/res");
const verifyToken = require("../middleware/auth");
const SingleFile = require("../models/SingleFile");
const { fileSizeFormatter } = require("../controllers/upload");
const mongoose = require("mongoose");
const {ObjectId} = require('mongodb');
router.get("/getPostByIdImage/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  Post.find({
    attachments: {
      $elemMatch: {
        id: ObjectId(id)
      }
    },
  }).then((rs) => {
    console.log(rs);
    res.json({ success: true, data: rs, message: "true" });
  });
});

// CREATE POST
router.post("/", verifyToken, async (req, res) => {
  const { title, text, audience, attachments, postParent } = req.body;
  req.io.sockets.emit("post", "post noti");
  if (!text && attachments.length === 0)
    return error400(res, "Nội dung bài đăng không được trống");
  try {
    console.log("s");
    let attachFile = [];
    if (attachments.length > 0) {
      attachFile = await Promise.all(
        attachments.map(async (e) => {
          const file = new SingleFile({
            fileName: e.name,
            filePath: e.file,
            fileType: e.type,
            fileSize: e.size, // 0.00
            user: req.userId,
          });
          await file.save();
          return { ...e, id: file._id };
        })
      );
    }
    console.log(attachFile);
    const newPost = new Post({
      title,
      text,
      poster: await User.findById(req.userId).then((user) => user),
      audience,
      attachments: attachFile,
      postParent,
    });
    await newPost.save();
    res.json(newPost);
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});
// DELETE POST
router.delete("/delete/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  Post.findByIdAndDelete(id)
    .then(() => {
      res.json({ success: true, message: "Xóa thành công", postId: id });
    })
    .catch((err) => {
      console.log(err);
      return error500({ success: false, message: "Xóa thất bại" });
    });
});

//UPDATE POST
router.put("/", verifyToken, async (req, res) => {
  const { postId, text, audience, attachments } = req.body;
  const date = new Date();
  const poster = await User.findById(req.userId).then((user) => user);

  const update = await {
    text,
    audience,
    attachments,
    updatedAt: date.getDate(),
  };
  Post.findByIdAndUpdate(postId, update)
    .setOptions({ new: true })
    .then((result) => {
      result.poster = poster;
      res.json(result);
    })
    .catch((err) => {
      return error500(err);
    });
});
// GET POST
// router.get("/", verifyToken, (req, res) => {
//   const { limitPost } = req.query;
//   Post.find()
//     .limit(limitPost)
//     .populate("poster")
//     .then((result) => {
//       res.json(result.reverse());
//     })
//     .catch((err) => {
//       console.log(err);
//       return error500(res);
//     });
// });
// GET POST PROFILE
router.get("/", verifyToken, (req, res) => {
  const { limitPost, profile } = req.query;
  console.log(limitPost, profile);
  if (profile == 1) {
    Post.find({ poster: req.userId })
      .limit(limitPost)
      .populate("poster")
      .then((result) => {
        console.log(result.length);
        res.json(result.reverse());
      })
      .catch((err) => {
        console.log(err);
        return error500(res);
      });
  } else {
    Post.find()
      .limit(limitPost)
      .populate("poster")
      .then((result) => {
        console.log(result.length);
        res.json(result.reverse());
      })
      .catch((err) => {
        console.log(err);
        return error500(res);
      });
  }
});

router.get("/likepost/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    let post = await Post.findById(id).populate("like.user");
    if (post.like.length > 0) {
      console.log("a");
      post.like = post.like.filter((e) => e.user._id.toString() !== req.userId);
      await post.save();
      const noti = await UserNotification({
        user: post.poster,
        type: 1,
        postId: post._id,
        fromUser: req.userId,
      });
      await noti.save();
      return res.json({
        success: true,
        data: post._id,
        message: "delete successfully",
      });
    } else {
      let like = {
        user: req.userId,
        createAt: Date.now(),
      };
      post.like.push(like);
      await post.save();
      const io = req.io;

      io.sockets
        .to(`user_${req.userId}`)
        .emit("notification", "you have new notification");
      return res.json({
        success: true,
        data: { postId: post._id, likePost: like },
        message: "create successfully",
      });
    }
  } catch (err) {
    console.log(err);
    return error500(res);
  }

  res.json({ code: 200, message: "successfully" });
});

router.get("/deleteall", verifyToken, async (req, res) => {
  try {
    // await Like.remove({});
    await SingleFile.remove({});
  } catch (err) {
    console.log(err);
    return error500(res);
  }
  return res.json({ code: 200 });
});

module.exports = router;
// router.post("/likepost/:id", verifyToken, async (req, res) => {
//   const { id } = req.params;
//   try {
//     let post = await Post.findById(id)
//       .populate("like")
//       .populate({
//         path: "like",
//         populate: { path: "user" },
//       });
//     if (post.like.length > 0) {
//       const found = post.like.find((e) => e.user._id.toString() === req.userId);
//       if (found !== undefined) {
//         await Like.findOneAndDelete({ _id: found._id });
//         return res.json({ code: 200, message: "delete successfully" });
//       }
//     } else {
//       let like = new Like({
//         user: req.userId,
//       });
//       await like.save();
//       post.like.push(like);
//       await post.save();
//       return res.json({ code: 200, message: "create successfully" });
//     }
//   } catch (err) {
//     console.log(err);
//     return error500(res);
//   }

//   res.json({ code: 200, message: "successfully" });
// });
