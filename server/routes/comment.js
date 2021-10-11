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
router.get("/getCommentPost/", verifyToken, async (req, res) => {
  const { idPost, index, pageSize } = req.query;
  console.log( idPost, index, pageSize) 
});
module.exports = router;
