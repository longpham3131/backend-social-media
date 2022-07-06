const express = require("express");
const router = express.Router();
const moment = require("moment");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const {
  FriendRequest,
  FriendRequestRespone,
  GetFriendsRequest,
  UnFriend,
  GetDataChartUser,
} = require("../controllers/friend");
const { error500, error400 } = require("../util/res");
const verifyToken = require("../middleware/auth");

const argon2 = require("argon2");
router.get("/getFriendRequest", verifyToken, GetFriendsRequest);
router.post("/unfriend", verifyToken, UnFriend);
router.post("/friendRequest", verifyToken, FriendRequest);
router.post("/friendRespone", verifyToken, FriendRequestRespone);

// GET ALL USER
// router.get("/user/", verifyToken, (req, res) => {
//   User.find().then((users) => {
//     try {
//       res.json(users);
//     } catch (error) {
//       return error500(res);
//     }
//   });
// });
// GET USER PER PAGE
router.get("/", verifyToken, (req, res) => {
  const page = Number.parseInt(req.query.page);
  const pageSize = Number.parseInt(req.query.pageSize);
  User.find()
    .skip(page)
    .limit(pageSize)
    .exec((err, users) => {
      User.count().exec((err, count) => {
        res.json({
          data: {
            items: users,
            pagination: {
              page,
              pageSize,
              totalElements: count,
              numberOfElements: users.length,
            },
          },
        });
      });
    });
});
//SEARCH USER
router.get("/search", verifyToken, (req, res) => {
  const searchKey = req.query.key;
  const page = Number.parseInt(req.query.page);
  const pageSize = Number.parseInt(req.query.pageSize);

  User.find({ fullName: searchKey })
    .sort({ fullName: "asc" })
    .limit(pageSize)
    .then((result) => {
      User.find({ fullName: searchKey }).then((totalResult) => {
        res.json({
          data: {
            items: result,
            pagination: {
              page,
              pageSize,
              totalElements: totalResult.length,
              numberOfElements: result.length,
            },
          },
        });
      });
    })
    .catch((err) => {
      return error500(err);
    });
});

// UPDATE USER
router.put("/", verifyToken, async (req, res) => {
  const data =
    req.body;
  const date = new Date();
  let updateData = {
    updatedAt: date.getDate(),
    ...data
  };

  if (data.newPassword) {
    updateData.password = await argon2.hash(data.newPassword);
  }

  // console.log("ABC", req.userId);

  await User.findByIdAndUpdate(req.userId, updateData)
    .setOptions({ new: true })
    .then((result) => {
      res.json(result);
      //   console.log(result);
    })
    .catch((err) => {
      return error500(err);
    });
});

router.post("/changePassword", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: ObjectId(req.userId) });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const passwordValid = await argon2.verify(user.password, oldPassword);
    if (!passwordValid) return error400(res, "Wrong old password");

    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res.json({
      success: "true",
      message: "Change password success",
      hashedPassword,
    });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

// DETELE USER
// router.put
router.get("/profile", verifyToken, (req, res) => {
  // console.log("profile");
  User.findById(req.userId)
    .populate({ path: "friends.user", select: "fullName avatar isOnline" })
    .populate({ path: "friendsRequest.user", select: "fullName avatar" })
    .lean()
    .then((user) => {
      try {
        res.json({ success: true, data: user });
      } catch (error) {
        return error500(res);
      }
    });
});

router.get("/notification", verifyToken, (req, res) => {
  const userId = req.params.id;
  User.findById(userId).then((user) => {
    try {
      res.json(user);
    } catch (error) {
      return error500(res);
    }
  });
});
//GET USER DETAIL
router.get("/:id", verifyToken, (req, res) => {
  try {
    const userId = req.params.id;
    User.findById(userId)
      .populate({ path: "friends.user", select: "fullName avatar isOnline" })
      .populate({ path: "friendsRequest.user", select: "fullName avatar" })
      .lean()
      .then((user) => {
        try {
          res.json(user);
        } catch (error) {
          return error500(res);
        }
      });
  } catch (err) {
    return error500(res);
  }
});

// router.get("/fi", verifyToken, (req, res) => {
//   const userId = req.params.id;
//   User.findById(userId).then((user) => {
//     try {
//       res.json(user);
//     } catch (error) {
//       return error500(res);
//     }
//   });
// });

/////////////////////////////ADMIN/////////////////////////////////////

router.get("/search/:keySearch", verifyToken, (req, res) => {
  try {
    const keySearch = req.params.keySearch;
    const regex = new RegExp(keySearch, "i");
    User.find({ fullName: { $regex: regex } })
      .lean()
      .then((user) => {
        try {
          res.json(user);
        } catch (error) {
          return error500(res);
        }
      });
  } catch (err) {
    return error500(res);
  }
});

module.exports = router;
