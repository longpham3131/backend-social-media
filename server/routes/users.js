const express = require("express");
const router = express.Router();
const moment = require("moment");
const User = require("../models/User");
const Post = require("../models/Post");
const Group = require("../models/Group");
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
  const data = req.body;
  const date = new Date();
  let updateData = {
    updatedAt: date.getDate(),
    ...data,
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
router.get("/profile", verifyToken, async (req, res) => {
  // console.log("profile");
  try {
    let user = await User.findById(req.userId)
      .populate({
        path: "friends.user",
        select: "fullName avatar isOnline username",
      })
      .populate({ path: "friendsRequest.user", select: "fullName avatar" })
      .lean();
    let post = await Post.find({ poster: ObjectId(req.userId) });
    let gr = await Group.find({
      members: {
        $elemMatch: {
          user: Object(req.userId),
        },
      },
    })
      .select("members groupName isPrivate cover _id")
      .lean();
    user.groupCount = gr ? gr.length : 0;
    user.postCount = post ? post.length : 0;
    return res.json({ success: true, data: { ...user } });
  } catch (error) {
    return error500(res);
  }
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

// router.get("/getFriends", verifyToken, async (req, res) => {
//   try {
//     const userId = req.params.id;
//     let user = await User.findById(userId)
//       .populate({ path: "friends.user", select: "fullName avatar isOnline username" })
//       .populate({ path: "friendsRequest.user", select: "fullName avatar" })
//       .lean()
//     let post = await Post.find({ poster: ObjectId(req.userId) })
//     let gr = await Group.find({
//       members: {
//         $elemMatch: {
//           user: Object(req.userId)
//         }
//       }
//     }).select("members groupName isPrivate cover _id").lean()
//     user.groupCount = gr ? gr.length : 0
//     user.postCount = post ? post.length : 0
//     return res.json({ success: true, data: { ...user } });
//   }
//   catch (error) {
//     return error500(res);
//   }
// });

router.get("/getFriends/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .select("friends")
      .populate({
        path: "friends.user",
        select:
          "_id fullName avatar isOnline username groups coverPicture friends",
      })
      .lean();
    console.log("user", userId);
    let friends = user.friends;
    for (const fr of friends) {
      let post = await Post.find({ poster: ObjectId(fr._id) });
      fr.user.postCount = post ? post.length : 0;
      delete fr.createAt;
      delete fr._id;
    }

    return res.json({ success: true, data: friends });
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});
router.get("/getUsers2", verifyToken, async (req, res) => {
  const page = Number.parseInt(req.query.page);
  const pageSize = Number.parseInt(req.query.pageSize);
  let users = await User.find()
    .skip(page)
    .limit(pageSize)
    .select("_id fullName avatar coverPicture isOnline username groups friends")
    .lean();

  for (const fr of users) {
    let post = await Post.find({ poster: ObjectId(fr._id) });
    fr.postCount = post ? post.length : 0;
    delete fr.createAt;
  }
  let count = await User.count();
  return res.json({
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

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .populate({
        path: "friends.user",
        select: "fullName avatar isOnline username",
      })
      .populate({ path: "friendsRequest.user", select: "fullName avatar" })
      .lean();
    let post = await Post.find({ poster: ObjectId(req.userId) });
    let gr = await Group.find({
      members: {
        $elemMatch: {
          user: Object(req.userId),
        },
      },
    })
      .select("members groupName isPrivate cover _id")
      .lean();
    user.groupCount = gr ? gr.length : 0;
    user.postCount = post ? post.length : 0;
    return res.json({ success: true, data: { ...user } });
  } catch (error) {
    return error500(res);
  }
});

module.exports = router;
