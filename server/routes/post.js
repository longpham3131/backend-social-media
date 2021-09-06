const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const Post = require("../models/Post");
const { error500, error400 } = require("../util/res");
const verifyToken = require("../middleware/auth");
router.post("/", verifyToken, async (req, res) => {
  const { title, description, status } = req.body;

  if (!title) return error400(res, "title is required");
  try {
    const newPost = new Post({
      title,
      description,
      status: status || "1",
      user: "612f1e729a7e21f80b3689f7",
    });
    await newPost.save();
    res.json({
      success: true,
      data: newPost,
    });
  } catch (error) {
    return error500(res);
  }
});

module.exports = router;
