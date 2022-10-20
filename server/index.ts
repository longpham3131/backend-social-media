import express from"express";
import { instrument }  from"@socket.io/admin-ui";
import io from"socket.io";
import User  from"./models/User";
import mongoose = from("mongoose");
import authRouter = from("./routes/auth");
// import postRouter = from("./routes/post");
// import commentRouter = from("./routes/comment");
// import usersRouter = from("./routes/users");
// import usersNotificationRouter = from("./routes/userNotification");
// import uploadRouter = from("./routes/upload");
// import groupRouter = from("./routes/group");
// import adminRouter = from("./routes/admin");
// import verifyRouter = from("./routes/verify");
import { ObjectId } = from("mongodb");
import helmet = from("helmet");
import path = from("path");
import { cloudinary } = from("./util/cloudinary");
import cors = from("cors");
from("dotenv").config();

io(4001, {
  cors: {
    origin: "*",
  },
});
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
const users = [];
io.on("connection", (socket) => {
  socket.on("join-room", (room) => {
    socket.join(room);
  });
  socket.on("leave-all-and-join-room", async (room) => {
    console.log("joinnn");
    if (room == "user_undefined") return;
    const rooms = io.sockets.adapter.sids[socket.id];
    for (const room in rooms) {
      socket.leave(room);
    }
    users[socket.id] = room;
    console.log(socket.id, "-", room);
    await User.findByIdAndUpdate(room.slice(5), { isOnline: true });
    socket.join(room);
  });
  socket.on("disconnect", async () => {
    if (!users[socket.id]) return;
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
// app.use("/api/post", postRouter);
// app.use("/api/comment", commentRouter);
// app.use("/api/users", usersRouter);
// app.use("/api/group", groupRouter);
// app.use("/api/notification", usersNotificationRouter);
// app.use("/api/admin", adminRouter);
// app.use("/api/verify", verifyRouter);
// app.use("/api/upload", uploadRouter.routes);
// app.use("/filemanager", express.static(path.join(__dirname, "uploads")));

instrument(io, { auth: false });

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
