const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const usersRouter = require("./routes/users");
const uploadRouter = require("./routes/upload");
const helmet = require("helmet");
const path = require("path");
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

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/users", usersRouter);
app.use("/api/upload", uploadRouter.routes);
app.use("/filemanager", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
