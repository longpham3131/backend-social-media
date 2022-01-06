const express = require("express");
const router = express.Router();
const moment = require("moment");
const User = require("../models/User");
const AuthenticateCode = require("../models/AuthenticateCode");
const { makeid, error500, sendEmail } = require("../util/res");
router.post("/forgetPassword", async (req, res) => {
  try {
    const { email } = req.body;
    let find = await AuthenticateCode.find({ email });
    let genCode= makeid(6);
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
    sendEmail(genCode)
    return res.json({
      success: "true",
    });
  } catch (err) {
    console.log(err);
    return error500(res);
  }
});
module.exports = router;
