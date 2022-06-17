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

const PORT = process.env.PORT || 4000;
const userNotification = io.of("/notification");
userNotification.on("connection", (socket) => {
  // console.log("1", socket.id);
});
// userNotification.use((socket, next) => {
//   if (socket.handshake.auth.token) {
//     socket.username;
//     next();
//   } else {
//     next(new Error("Error token"));
//   }
// });
let users = [];
io.on("connection", (socket) => {
  // console.log("1", socket.id);
  // socket.on('test',(rq)=>{
  //   console.log('sss',rq)
  //  io.emit('receive-message','server rs')
  // })
  // socket.to(room).emit("receive-noti",'noti')

  socket.on("join-room", (room) => {
    socket.join(room);
  });
  socket.on("leave-all-and-join-room", async (room) => {
    if(room=="user_undefined") return
    var rooms = io.sockets.adapter.sids[socket.id];
    for (var room in rooms) {
      socket.leave(room);
    }
    users[socket.id] = room;
  
    await User.findByIdAndUpdate(room.slice(5), { isOnline: true });
    socket.join(room);
  });
  socket.on("disconnect", async () => {
    if(!users[socket.id]) return
    console.log("disconnect " + users[socket.id].slice(5));
    await User.findByIdAndUpdate(users[socket.id].slice(5), {
      isOnline: false,
    });
  });
});

app.use(function (req, res, next) {
  req.io = io;
  next();
});
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/users", usersRouter);
app.use("/api/group", groupRouter);
app.use("/api/notification", usersNotificationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/verify", verifyRouter);
app.use("/api/upload", uploadRouter.routes);
app.use("/filemanager", express.static(path.join(__dirname, "uploads")));

instrument(io, { auth: false });

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
