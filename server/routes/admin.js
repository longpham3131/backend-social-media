const express = require("express");
const router = express.Router();
const moment = require("moment");
const User = require("../models/User");
const ReportUser = require("../models/ReportUser");
const ReportPost = require("../models/ReportPost");
const UserNotification = require("../models/UserNotification");
const ActivityHistory = require("../models/ActivityHistory");
const Post = require("../models/Post");
const { ObjectId } = require("mongodb");
const {
  error500,
  error400,
  getDataChartUserDay,
  getDataChartUserMonth,
  getDataChartUserYear,
} = require("../util/res");
const verifyToken = require("../middleware/auth");
router.get("/getUsers", verifyToken, async (req, res) => {
  try {
    User.find()
      .select(["-password"])
      .populate({ path: "friends.user", select: "fullName avatar" })
      .populate({ path: "friendsRequest.user", select: "fullName avatar" })
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

router.get("/getUsersDetail/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    User.find({ _id: ObjectId(userId) })
      .select(["-password"])
      .populate({ path: "friends.user", select: "-password" })
      .populate({ path: "friendsRequest.user", select: "-password" })
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
    const { type, content, user } = req.body;
    let ru = new ReportUser({
      type,
      content,
      user: ObjectId(user),
      userReport: ObjectId(req.userId),
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
      postId: ObjectId(postId),
      userReport: ObjectId(req.userId),
    });
    await rp.save();
    return res.json({ success: true, data: rp });
  } catch (err) {
    return error500(res);
  }
});

router.get("/getRepostsPost", verifyToken, async (req, res) => {
  try {
    let result = await ReportPost.find()
      .populate("userReport")
      .populate("postId");
    return res.json({ success: true, data: result });
  } catch (err) {
    return error500(res);
  }
});
router.get("/getRepostsUser", verifyToken, async (req, res) => {
  try {
    let result = await ReportUser.find()
      .populate("userReport")
      .populate("user");
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
    const { reportId, data } = req.body;
    await ReportPost.findOneAndUpdate({ _id: ObjectId(reportId) }, data);
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

router.post("/editReportUser", verifyToken, async (req, res) => {
  try {
    const { reportId, data } = req.body;
    await ReportUser.findOneAndUpdate({ _id: ObjectId(reportId) }, data);
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

router.post("/editPost", verifyToken, async (req, res) => {
  try {
    const { postId, data } = req.body;
    await Post.findOneAndUpdate({ _id: ObjectId(postId) }, data);
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

///Chart

router.post("/getDataChartUser", verifyToken, async (req, res) => {
  try {
    const { type, fromTime, toTime } = req.body;
    console.log(type, fromTime, toTime);
    let startDate = moment(fromTime).clone().startOf("day");
    let endDate = moment(toTime).clone().endOf("day");
    let listDays = null;
    switch (type) {
      case "day":
        listDays = getDataChartUserDay(startDate, endDate);
        break;
      case "month":
        listDays = getDataChartUserMonth(startDate, endDate);
        break;
      case "year":
        listDays = getDataChartUserYear(startDate, endDate);
        break;
    }
    getDataChartUserDay(startDate, endDate);
    console.log(listDays);
    let countMax = 0;
    let count = 0;
    let listData = await Promise.all(
      listDays.map(async (day) => {
        let resultLike = await UserNotification.find({
          createAt: {
            $gte: day,
            $lte: day.clone().endOf(type),
          },
          type: 1,
        }).lean();
        let resultComment = await UserNotification.find({
          createAt: {
            $gte: day,
            $lte: day.clone().endOf(type),
          },
          type: 2,
        }).lean();
        // console.log(day);
        countMax = countMax < resultLike.length ? resultLike.length : countMax;
        countMax =
          countMax < resultComment.length ? resultComment.length : countMax;
        count = count + resultLike.length + resultComment.length;
        return {
          day: day,
          like: resultLike.length,
          comment: resultComment.length,
        };
      })
    );

    // console.log(moment(listData[0].day));
    return res.json({ success: true, data: listData, countMax, count });
    return;
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});

router.post("/test", verifyToken, async (req, res) => {
  try {
    let currentDate = moment();
    let startDate = currentDate.clone().startOf("day");
    let endDate = currentDate.clone().endOf("day");
    let listDays = getDataChartUserDay(startDate, endDate);

    console.log(listDays);
    let countMax = 0;
    let count = 0;
    let listData = await Promise.all(
      listDays.map(async (day) => {
        let resultLike = await UserNotification.find({
          createAt: {
            $gte: day,
            $lte: day.clone().endOf("day"),
          },
          type: 1,
        }).lean();
        let resultComment = await UserNotification.find({
          createAt: {
            $gte: day,
            $lte: day.clone().endOf("day"),
          },
          type: 2,
        }).lean();
        // console.log(day);
        countMax = countMax < resultLike.length ? resultLike.length : countMax;
        countMax =
          countMax < resultComment.length ? resultComment.length : countMax;
        count = count + resultLike.length + resultComment.length;
        return {
          day: day,
          like: resultLike.length,
          comment: resultComment.length,
        };
      })
    );

    // console.log(moment(listData[0].day));
    return res.json({ success: true, data: listData, countMax, count });
    return;
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});

router.get("/getDataChartUserActivity", verifyToken, async (req, res) => {
  try {
    let currentDate = moment();
    let startDate = currentDate.clone().startOf("day");
    let endDate = currentDate.clone().endOf("day");

    let result = await ActivityHistory.find({
      createAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    // console.log(day);

    // console.log(moment(listData[0].day));
    return res.json({ success: true, data: result.length });
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});

router.get("/checkInActivity", verifyToken, async (req, res) => {
  try {
    let currentDate = moment();
    let strDate = currentDate.format("DD/MM/YYYY").toString();
    console.log(strDate);
    let result = await ActivityHistory.find({
      user: ObjectId(req.userId),
      createAt: {
        $gte: currentDate.clone().startOf("day"),
        $lte: currentDate.clone().endOf("day"),
      },
    }).lean();
    if (result.length == 0) {
      let activityHistory = new ActivityHistory({
        user: ObjectId(req.userId),
        createAt: currentDate,
        strDate: strDate,
      });
      await activityHistory.save();
    }

    return res.json({ success: true });
  } catch (err) {
    return error500(res);
  }
});

router.get("/getDataChartUserNew", verifyToken, async (req, res) => {
  try {
    let currentDate = moment();
    let strDate = currentDate.format("DD/MM/YYYY").toString();
    console.log(strDate);
    let result = await User.find({
      createAt: {
        $gte: currentDate.clone().startOf("day"),
        $lte: currentDate.clone().endOf("day"),
      },
    }).lean();

    console.log(result);

    return res.json({ success: true, data: result.length });
  } catch (err) {
    return error500(res);
  }
});

//Chart 

router.post("/getDataChartUserActivities", verifyToken, async (req, res) => {
  try {
    const { type, fromTime, toTime } = req.body;
    console.log(type, fromTime, toTime);
    let startDate = moment(fromTime).clone().startOf("day");
    let endDate = moment(toTime).clone().endOf("day");
    let listDays = null;
    switch (type) {
      case "day":
        listDays = getDataChartUserDay(startDate, endDate);
        break;
      case "month":
        listDays = getDataChartUserMonth(startDate, endDate);
        break;
      case "year":
        listDays = getDataChartUserYear(startDate, endDate);
        break;
    }
    getDataChartUserDay(startDate, endDate);
    console.log(listDays);
    let countMax = 0;
    let listData = await Promise.all(
      listDays.map(async (day) => {
        let result = await ActivityHistory.find({
          createAt: {
            $gte: day,
            $lte: day.clone().endOf(type),
          },
        }).lean();
       
        // console.log(day);
        countMax = countMax < result.length ? result.length : countMax;
        return {
          day: day,
          count: result.length,
        };
      })
    );

    // console.log(moment(listData[0].day));
    return res.json({ success: true, data: listData, countMax });
    return;
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});
module.exports = router;
