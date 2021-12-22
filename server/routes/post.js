const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const Post = require("../models/Post");
const Comment = require("../models/comment");
const Like = require("../models/Like");
const User = require("../models/User");
const UserNotification = require("../models/UserNotification");
const { error500, error400 } = require("../util/res");
const verifyToken = require("../middleware/auth");
const SingleFile = require("../models/SingleFile");
const { fileSizeFormatter } = require("../controllers/upload");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

//GET ID POST BY ID IMAGE
router.get("/getPostByIdImage/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  Post.find({
    attachments: {
      $elemMatch: {
        id: ObjectId(id),
      },
    },
  })
    .populate("poster")
    .populate({
      path: "comments",
      options: {
        skip: 0,
        perDocumentLimit: 10,
        sort: { createAt: "descending" },
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
    .populate({
      path: "like",
      populate: { path: "user", select: "username fullName avatar" },
    })
    .then((rs) => {
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
    const newPost = new Post({
      title,
      text,
      poster: ObjectId(req.userId),
      audience,
      attachments: attachFile,
      postParent,
    });
    await newPost.save();
    const newPoster = await User.findById(req.userId);
    newPost.poster = newPoster;
    res.json(newPost);
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});
// DELETE POST
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    let post = await Post.findById(id);
    post.attachments.forEach(
      async (file) => await SingleFile.findByIdAndDelete(file.id)
    );
    await Post.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    return error500({ success: false, message: "Xóa thất bại" });
  }
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
router.get("/", verifyToken, async (req, res) => {
  const { limitPost, index, profile, userId } = req.query;
  console.log(typeof limitPost === "string", index, profile, userId);
  try {
    let data = { status: 1 };
    if (profile == 1) {
      const userIdReq = userId != "0" ? userId : req.userId;
      data = { poster: userIdReq, status: 1 };
    }
    const result = await Post.find(data)
      .sort({ createAt: -1 })
      .skip(index * limitPost)
      .limit(+limitPost)
      .populate("poster")
      .populate({
        path: "comments",
        options: {
          skip: 0,
          perDocumentLimit: 10,
          sort: { createAt: "descending" },
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
      .populate({
        path: "like",
        populate: { path: "user", select: "username fullName avatar" },
      })
      .lean();
    // result.comments=result.comments?.reverse()
    return res.json(result);
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

router.get("/getPostById/:postId", verifyToken, async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await Post.findById(postId)
      .populate("poster")
      .populate({
        path: "comments",
        options: {
          skip: 0,
          perDocumentLimit: 10,
          sort: { createAt: "descending" },
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
      .populate({
        path: "like",
        populate: { path: "user", select: "username fullName avatar" },
      })
      .lean();
    // result.comments=result.comments?.reverse()
    return res.json(result);
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

// const getPosts =async (limitPost, index, profile, userId,reqUserId) => {
//   let data = {};
//   let userIdReq = userId;
//   if (profile == 1) {
//     if (userId == "0")
//       userIdReq = reqUserId;
//     data = { poster: userIdReq };
//   }
//   let result = await Post.find({
//     data: data,
//     skip: index * limitPost,
//     limit: limitPost,
//   });
//   result= result.reverse()
//   return result;
// };

// router.get("/", verifyToken, async (req, res) => {
//   const { limitPost, index, profile, userId } = req.query;
//   try {
//     let data = {};
//     if (profile == 1) {
//       const userIdReq = userId != "0" ? userId : req.userId;
//       data = { poster: userIdReq };
//     }
//     const result = await Post.find(data)
//       .skip(index * limitPost)
//       .limit(limitPost);
//     return res.json(result.reverse());
//   } catch (err) {
//     console.log(err);
//     return error500(res);
//   }
// });

//LIKE POST
router.get("/likepost/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const io = req.io;
  try {
    let post = await Post.findById(id).populate("like.user");
    const { _id, avatar, fullName, username } = await User.findById(req.userId);
    let userForNoti = await User.findById(req.userId).select("fullName avatar");
    if (
      post.like.some(
        (item) => item.user._id == req.userId || item.user == req.userId
      )
    ) {
      // console.log("a");

      post.like = post.like.filter((e) => e.user._id.toString() !== req.userId);
      await post.save();
      const notiDelete = await UserNotification.findOneAndDelete({
        user: ObjectId(post.poster),
        postId: post._id,
        fromUser: ObjectId(req.userId),
        type: 1,
      });
      io.sockets.to(`user_${post.poster.toString()}`).emit("notification", {
        data: {
          postId: post._id,
          fromUser: userForNoti,
          type: -1,
        },
      });
      return res.json({
        like: false,
        postId: post._id,
        user: { _id, avatar, fullName, username },
      });
    } else {
      let like = {
        user: req.userId,
        createAt: Date.now(),
      };
      post.like.push(like);
      await post.save();

      const noti = await UserNotification({
        user: post.poster,
        type: 1,
        postId: post._id,
        fromUser: req.userId,
      });
      await noti.save();
      io.sockets.to(`user_${post.poster.toString()}`).emit("notification", {
        data: {
          user: post.poster,
          type: 1,
          postId: post._id,
          fromUser: userForNoti,
        },
      });
      return res.json({
        like: true,
        postId: post._id,
        user: { _id, avatar, fullName, username },
        createAt: Date.now(),
      });
    }
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

router.get("/deleteall", verifyToken, async (req, res) => {
  try {
    res.send("ok");
    await performComplexTasks(req);
    console.log("wait");
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});
async function performComplexTasks(req) {
  const post = new Post({ poster: req.userId });
  await post.save();
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

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
