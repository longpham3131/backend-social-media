const express = require("express");
const app = express();
// mongoose : Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
const mongoose = require("mongoose");
// helmet: giúp bảo mật thông tin nhạy cảm => mã hóa thông tin
const helmet = require("helmet");
// dotenv: Tải các biến môi trường từ tệp .env vào process.env.
const dotenv = require("dotenv");
// morgan: HTTP request logger middleware for node.js
const morgan = require("morgan");

//route
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { seNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected mongoDB");
  }
);

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.listen(8800, () => {
  console.log("BACKEND IS RUNNING");
});
