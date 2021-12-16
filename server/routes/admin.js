const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ReportUser = require("../models/ReportUser");
const ReportPost = require("../models/ReportPost");

const Post = require("../models/Post");
const { ObjectId } = require("mongodb");
const { error500, error400 } = require("../util/res");
const verifyToken = require("../middleware/auth");

router.get("/getUsers", verifyToken, async (req, res) => {
  try {
    User.find()
      .select(["-password", "-createAt"])
      .lean()
      .then((rs) => {
        try {
          return res.json({ success: true, data: rs });
        } catch (error) {
          return error500(res);
        }
      });
  } catch (err) {
    return error500(res);
  }
});
router.post("/createReportUser", verifyToken, async (req, res) => {
  try {
    const { type, content } = req.body;
    let ru = new ReportUser({
      type,
      content,
      user: ObjectId(req.userId),
    });
    await ru.save();
    return res.json({ success: true, data: ru });
  } catch (err) {
    return error500(res);
  }
});
router.post("/createReportPost", verifyToken, async (req, res) => {
  try {
    const { type, content, postId } = req.body;
    let rp = new ReportPost({
      type,
      content,
      postId,
      user: ObjectId(req.userId),
    });
    await rp.save();
    return res.json({ success: true, data: rp });
  } catch (err) {
    return error500(res);
  }
});

router.get("/getRepostsPost", verifyToken, async (req, res) => {
  try {
    let result = await ReportPost.find().populate("user").populate("postId");
    return res.json({ success: true, data: result });
  } catch (err) {
    return error500(res);
  }
});
router.get("/getRepostsUser", verifyToken, async (req, res) => {
  try {
    let result = await ReportUser.find().populate("user");
    return res.json({ success: true, data: result });
  } catch (err) {
    return error500(res);
  }
});

router.get("/getUsers2/:keySearch", verifyToken, async (req, res) => {
  try {
    const { keySearch } = req.params;
    let result = null;
    if (keySearch === "null") {
      result = await User.find().select(["-password", "-createAt"]).lean();
    } else {
      const objId = new ObjectId(
        keySearch.length < 24 ? "123412341234123412341234" : keySearch
      );
      const regex = new RegExp(keySearch, "i");
      result = await User.find({
        $or: [
          { _id: objId },
          { username: { $regex: regex } },
          { email: { $regex: regex } },
          { fullName: { $regex: regex } },
        ],
      }).select(["-password"]);
    }
    return res.json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

router.post("/editUser", verifyToken, async (req, res) => {
  try {
    const { userId, data } = req.body;
    await User.findOneAndUpdate({ _id: ObjectId(userId) }, data);
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

router.post("/editStatusUser", verifyToken, async (req, res) => {
  try {
    const { userId, status } = req.body;
    await User.findOneAndUpdate({ _id: ObjectId(userId) }, { status });
    await Post.updateMany({ poster: ObjectId(userId) }, { status });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});
router.post("/editStatusUser2", verifyToken, async (req, res) => {
  try {
    await Post.updateMany({}, { status: 1 });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

router.post("/editReportPost", verifyToken, async (req, res) => {
  try {
    const { userId, data } = req.body;
    await ReportUser.findOneAndUpdate({ _id: ObjectId(userId) }, data);
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

router.post("/editReportUser", verifyToken, async (req, res) => {
  try {
    const { userId, data } = req.body;
    await ReportUser.findOneAndUpdate({ _id: ObjectId(userId) }, data);
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

router.post("/editPost", verifyToken, async (req, res) => {
  try {
    const { userId, data } = req.body;
    await Post.findOneAndUpdate({ _id: ObjectId(userId) }, data);
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

router.get("/getPosts", verifyToken, async (req, res) => {
  try {
    const result = await Post.find()
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
    return res.json({ success: true, data: result });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});
router.get;
module.exports = router;
