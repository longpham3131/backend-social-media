const Post = require("../models/Post");
const Comment = require("../models/comment");
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
    const { postId, content, file=null, parentComment = null } = req.body;
    const comment = new Comment({
      content,
      file,
      parentComment,
    });
    const rs = await Promise.all([comment.save(), Post.findById(postId)]);
    rs[1].comments.push(comment._id);
    await rs[1].save();
    res.json({ success: true, data: rs[0], message: "true" });
  } catch (err) {
    error500(res);
  }
});
module.exports = router;