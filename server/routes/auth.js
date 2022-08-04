const express = require("express");
const router = express.Router();
const moment = require("moment");
const argon2 = require("argon2");
const User = require("../models/User");
const AuthenticateCode = require("../models/AuthenticateCode");
const { ObjectId } = require("mongodb");
const MultipleFile = require("../models/MultipleFile");
const jwt = require("jsonwebtoken");
// require("dotenv").config();
router.get("/", (req, res) => res.send("USER ROUTE"));
const { error500, error400, makeid, sendEmail } = require("../util/res");
//@route POST api/auth/register

//REGISTER
router.post("/register", async (req, res) => {
  const { username, password, email, fullName } = req.body;
  res.header("Access-Control-Allow-Origin", "*");
  if (!username || !password || !email)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });
  try {
    //check exits user
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Account already exists" });
    const emailuser = await User.findOne({ email });
    if (emailuser)
      return res
        .status(400)
        .json({ success: false, message: "" });
    const hashedPassword = await argon2.hash(password);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      fullName,
      createAt: moment(),
    });
    await newUser.save();
    const date = new Date();
    date.setDate(date.getDate() + 3);
    //Return token
    const accessToken = jwt.sign(
      { userId: newUser._id, expired: date },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      hash: hashedPassword,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});
//@route POST api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) return error400(res, "Wrong Username or Password");
<<<<<<< HEAD
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return error400(res, "Wrong Username or Password");

    const date = new Date();
    date.setDate(date.getDate() + 300000);
    const accessToken = jwt.sign(
      { userId: user._id, expired: date },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "Login successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});
router.post("/loginAdmin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, isAdmin: true });

    if (!user) return error400(res, "Wrong Username or Password");
=======
>>>>>>> refactor-FE
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return error400(res, "Wrong Username or Password");

    const date = new Date();
    date.setDate(date.getDate() + 300000);
    const accessToken = jwt.sign(
      { userId: user._id, expired: date },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "Login successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});
router.post("/loginAdmin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) return error400(res, "Wrong Username or Password");
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return error400(res, "Wrong Username or Password");

<<<<<<< HEAD
=======
    const date = new Date();
    date.setDate(date.getDate() + 300000);
    const accessToken = jwt.sign(
      { userId: user._id, expired: date },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      message: "Login successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});

>>>>>>> refactor-FE
router.post("/verifyCode", async (req, res) => {
  try {
    const { code } = req.body;
    let data = await checkValidCode(code);
    delete data.findCode;
    return res.json(data);
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

const checkValidCode = async (code) => {
  let findCode = await AuthenticateCode.findOne({ code: code });
  if (!findCode) {
    return {
      success: false,
      message: "Your code are invalid",
    };
  }
  if (moment(findCode.expireAt).isBefore(moment())) {
    return {
      success: false,
      message: "Your code are expired",
    };
  }

  return {
    success: true,
    message: "",
    findCode,
  };
};

router.post("/changePasswordByCode", async (req, res) => {
  try {
    const { code, newPassword } = req.body;
    let data = await checkValidCode(code);
    if (!data.success) {
      return res.json(data);
    }
    const user = await User.findOne({ email: data.findCode.email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;

    await user.save();
    return res.json({
      success: "true",
      message: "Change password success",
      hashedPassword,
      username:user.username
    });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});

router.post("/forgetPassword", async (req, res) => {
  try {
    const { email } = req.body;
    let findUser = await User.findOne({ email });
    if (!findUser)
      return res.json({
        success: "false",
      });
    let find = await AuthenticateCode.find({ email });
    let genCode = makeid(6);
    if (find.length == 0) {
      let authenticateCode = new AuthenticateCode({
        email,
        code: genCode,
      });
      await authenticateCode.save();
    } else {
      let upt = await AuthenticateCode.findOneAndUpdate(
        { email },
        {
          code: genCode,
          createAt: moment(),
          expireAt: moment().add(30, "minutes"),
        }
      );
      console.log("upt", upt);
    }
    sendEmail(genCode, email);
    return res.json({
      success: "true",
    });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});
module.exports = router;
