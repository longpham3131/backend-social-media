const express = require("express");
const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(4001, {
  cors: {
    origin: "*",
  },
});
const User = require("./models/User");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const usersRouter = require("./routes/users");
const usersNotificationRouter = require("./routes/userNotification");
const uploadRouter = require("./routes/upload");
const groupRouter = require("./routes/group");
const adminRouter = require("./routes/admin");
const verifyRouter = require("./routes/verify");
const { ObjectId } = require("mongodb");
const helmet = require("helmet");
const path = require("path");
const { cloudinary } = require("./util/cloudinary");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 4000;

instrument(io, { auth: false });
const { readFileSync, promises: fsPromises } = require('fs');

// ✅ read file SYNCHRONOUSLY
function syncReadFile(filename) {
  const contents = readFileSync(filename, 'utf-8');

  const arr = contents.split(/\r?\n/);
  let arrmin = []
  for (const so of arr) {
    if (!isNaN(so)) {
      let a = Number(so)
      if (Number.isInteger(a) && a !== 0) { 
        if (arrmin[a] === undefined) 
          arrmin[a] = 0
        else
          arrmin[a] += 1
      }
    }
  }
  for (let index = 0; index < arrmin.length; index++) {
    if (arrmin[index] === 0) {
      console.log(index) 
    }
  }
}

syncReadFile('./so.txt');

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
