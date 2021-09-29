const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const Post = require("../models/Post");
const User = require("../models/User");
const { error500, error400 } = require("../util/res");
const verifyToken = require("../middleware/auth");

// CREATE POST
router.post("/", verifyToken, async (req, res) => {
  const { title, text, audience, attachments, postParent } = req.body;
  if (!text && attachments.length === 0)
    return error400(res, "Nội dung bài đăng không được trống");
  try {
    const newPost = new Post({
      title,
      text,
      poster: await User.findById(req.userId).then((user) => user),
      audience,
      attachments,
      postParent,
    });
    await newPost.save();
    res.json(newPost);
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});
// DELETE POSS
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
router.get("/", verifyToken, (req, res) => {
  const { limitPost } = req.query;
  Post.find()
    .limit(limitPost)
    .populate("poster")
    .then((result) => {
      res.json(result.reverse());
    })
    .catch((err) => {
      console.log(err);
      return error500(res);
    });
});
router.get("/deleteall", verifyToken, (req, res) => {
  Post.remove({});
  res.json({ code: 200 });
});

module.exports = router;
