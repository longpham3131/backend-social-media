const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const Post = require("../models/Post");
const { error500, error400 } = require("../util/res");
const verifyToken = require("../middleware/auth");

// CREATE POST
router.post("/", verifyToken, async (req, res) => {
  const { title, text, audience, poster, attachments, postParent } = req.body;
  if (!text && !attachments.length === 0)
    return error400(res, "Nội dung bài đăng không được trống");
  try {
    const newPost = new Post({
      title,
      text,
      audience,
      poster,
      attachments,
      postParent,
    });
    await newPost.save();
    res.json({
      success: true,
      data: newPost,
    });
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
      res.json({ success: true, message: "Xóa thành công" });
    })
    .catch((err) => {
      console.log(err);
      return error500({ success: false, message: "Xóa thất bại" });
    });
});

//UPDATE POST
router.put("/", verifyToken, (req, res) => {
  const { postId, text, audience, attachments } = req.body;
  const date = new Date();
  const update = {
    text,
    audience,
    attachments,
    updatedAt: date.getDate(),
  };
  Post.findByIdAndUpdate(postId, update)
    .setOptions({ new: true })
    .then((result) => {
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
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      return error500(err);
    });
});

module.exports = router;
