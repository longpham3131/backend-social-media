const express = require("express");
const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(5001, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
  },
});
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const usersRouter = require("./routes/users");
const uploadRouter = require("./routes/upload");
const helmet = require("helmet");
const path = require("path");
const { cloudinary } = require("./util/cloudinary");
const cors = require("cors");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mkhxv.mongodb.net/SocialNetWork?retryWrites=true&w=majority`,
      (err) => {
        if (err) throw err;
        console.log("connected to MongoDB");
      }
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());

const PORT = process.env.PORT || 5000;
const userNotification = io.of("/notification");
userNotification.on("connection", (socket) => {
  console.log("1", socket.id);
});
// userNotification.use((socket, next) => {
//   if (socket.handshake.auth.token) {
//     socket.username;
//     next();
//   } else {
//     next(new Error("Error token"));
//   }
// });
io.on("connection", (socket) => {
  console.log("1", socket.id);
  // socket.on('test',(rq)=>{
  //   console.log('sss',rq)
  //  io.emit('receive-message','server rs')
  // })
  // socket.to(room).emit("receive-noti",'noti')
  socket.on("join-room", (room) => {
    socket.join(room);
  });

});

app.use(function (req, res, next) {
  req.io = io;
  next();
});
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/users", usersRouter);
app.use("/api/upload", uploadRouter.routes);
app.use("/filemanager", express.static(path.join(__dirname, "uploads")));

instrument(io, { auth: false });

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
