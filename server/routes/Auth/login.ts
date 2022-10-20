
import argon2 from 'argon2';
import express, {Request, Response, Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { error400, error500 } from '../../util/res';

const router: Router = express.Router();
router.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) return error400(res, "Wrong Username or Password");
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) return error400(res, "Wrong Username or Password");
    const date = new Date();
    date.setDate(date.getDate() + 300000);
    const accessToken = jsonwebtoken.sign(
      { userId: user._id, expired: date },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return error500(res);
  }
});

module.exports = router;