const express = require("express");
const router = express.Router();
const User = require("../models/User");
const UserNotification = require("../models/UserNotification");
const { error500, error400 } = require("../util/res");
const verifyToken = require("../middleware/auth");

router.get("", verifyToken, async(req, res) => {
  const cound=await UserNotification.countDocuments({ user: req.userId})
  UserNotification.find({ user: req.userId }).populate("fromUser").then((rs) => {
    try {
      res.json({ code: 200, data: rs ,total:cound});
    } catch (error) {
      console.log(error)
      return error500(res);
    }
  });
});

module.exports = router;
