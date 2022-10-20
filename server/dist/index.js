"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_ui_1 = require("@socket.io/admin-ui");
const socket_io_1 = __importDefault(require("socket.io"));
const User_1 = __importDefault(require("./models/User"));
var mongoose = from;
("mongoose");
var authRouter = from;
("./routes/auth");
var helmet = from;
("helmet");
("path");
var cors = from;
("cors");
from("dotenv").config();
(0, socket_io_1.default)(4001, {
    cors: {
        origin: "*",
    },
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mkhxv.mongodb.net/SocialNetWork?retryWrites=true&w=majority`, (err) => {
            if (err)
                throw err;
            console.log("connected to MongoDB");
        });
    }
    catch (error) {
        console.log(error.message);
        process.exit(1);
    }
});
connectDB();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors({
    origin: "*",
}));
app.use(helmet());
const PORT = process.env.PORT || 4000;
const userNotification = socket_io_1.default.of("/notification");
const users = [];
socket_io_1.default.on("connection", (socket) => {
    socket.on("join-room", (room) => {
        socket.join(room);
    });
    socket.on("leave-all-and-join-room", (room) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("joinnn");
        if (room == "user_undefined")
            return;
        const rooms = socket_io_1.default.sockets.adapter.sids[socket.id];
        for (const room in rooms) {
            socket.leave(room);
        }
        users[socket.id] = room;
        console.log(socket.id, "-", room);
        yield User_1.default.findByIdAndUpdate(room.slice(5), { isOnline: true });
        socket.join(room);
    }));
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        if (!users[socket.id])
            return;
        console.log("disconnect " + users[socket.id].slice(5));
        yield User_1.default.findByIdAndUpdate(users[socket.id].slice(5), {
            isOnline: false,
        });
    }));
});
app.use(function (req, res, next) {
    req.io = socket_io_1.default;
    next();
});
app.use("/api/auth", authRouter);
(0, admin_ui_1.instrument)(socket_io_1.default, { auth: false });
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//# sourceMappingURL=index.js.map