const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { error500, error400 } = require("../util/res");
const verifyToken = require("../middleware/auth");
const argon2 = require("argon2");

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
  const { fullName, newPassword, email, avatar, coverPicture } = req.body;
  const hashedPassword = await argon2.hash(newPassword);
  const date = new Date();

  const updateData = {
    fullName,
    password: hashedPassword,
    email,
    avatar,
    coverPicture,
    updatedAt: date.getDate(),
  };

  await User.findByIdAndUpdate(req.body.id, updateData)
    .setOptions({ new: true })
    .then((result) => {
      res.json(result);
      //   console.log(result);
    })
    .catch((err) => {
      return error500(err);
    });
});

// DETELE USER
// router.put

//GET USER DETAIL
router.get("/:id", verifyToken, (req, res) => {
  const userId = req.params.id;
  User.findById(userId).then((user) => {
    try {
      res.json(user);
    } catch (error) {
      return error500(res);
    }
  });
});

module.exports = router;
