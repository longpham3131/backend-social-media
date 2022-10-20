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
const moment_1 = __importDefault(require("moment"));
const argon2_1 = __importDefault(require("argon2"));
const User_1 = __importDefault(require("../shemas/User"));
const AuthenticateCode_1 = __importDefault(require("../shemas/AuthenticateCode"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const res_1 = require("../util/res");
const router = express_1.default.Router();
const app = (0, express_1.default)();
router.get("/", (req, res) => res.send("USER ROUTE"));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, fullName } = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    if (!username || !password || !email)
        return res
            .status(400)
            .json({ success: false, message: "Missing username or password" });
    try {
        const user = yield User_1.default.findOne({ username });
        if (user)
            return res
                .status(400)
                .json({ success: false, message: "Account already exists" });
        const emailuser = yield User_1.default.findOne({ email });
        if (emailuser)
            return res.status(400).json({ success: false, message: "" });
        const hashedPassword = yield argon2_1.default.hash(password);
        const newUser = new User_1.default({
            username,
            password: hashedPassword,
            email,
            fullName,
            createAt: (0, moment_1.default)(),
        });
        yield newUser.save();
        const date = new Date();
        date.setDate(date.getDate() + 3);
        const accessToken = jsonwebtoken_1.default.sign({ userId: newUser._id, expired: date }, process.env.ACCESS_TOKEN_SECRET);
        res.json({
            hash: hashedPassword,
            accessToken,
        });
    }
    catch (error) {
        console.log(error);
        return (0, res_1.error500)(res);
    }
}));
router.post("/loginAdmin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ username });
        if (!user)
            return (0, res_1.error400)(res, "Wrong Username or Password");
        const passwordValid = yield argon2_1.default.verify(user.password, password);
        if (!passwordValid)
            return (0, res_1.error400)(res, "Wrong Username or Password");
        const date = new Date();
        date.setDate(date.getDate() + 300000);
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, expired: date }, process.env.ACCESS_TOKEN_SECRET);
        res.json({
            success: true,
            message: "Login successfully",
            accessToken,
        });
    }
    catch (error) {
        console.log(error);
        return (0, res_1.error500)(res);
    }
}));
router.post("/verifyCode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.body;
        const data = yield checkValidCode(code);
        delete data.findCode;
        return res.json(data);
    }
    catch (err) {
        console.log(err);
        return (0, res_1.error500)(res);
    }
}));
const checkValidCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const findCode = yield AuthenticateCode_1.default.findOne({ code: code });
    if (!findCode) {
        return {
            success: false,
            message: "Your code are invalid",
        };
    }
    if ((0, moment_1.default)(findCode.expireAt).isBefore((0, moment_1.default)())) {
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
});
router.post("/changePasswordByCode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, newPassword } = req.body;
        const data = yield checkValidCode(code);
        if (!data.success) {
            return res.json(data);
        }
        const user = yield User_1.default.findOne({ email: data.findCode.email });
        if (!user)
            return res.json({ success: false, message: "User not found" });
        const hashedPassword = yield argon2_1.default.hash(newPassword);
        user.password = hashedPassword;
        yield user.save();
        return res.json({
            success: "true",
            message: "Change password success",
            hashedPassword,
            username: user.username,
        });
    }
    catch (err) {
        console.log(err);
        return (0, res_1.error500)(res);
    }
}));
router.post("/forgetPassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const findUser = yield User_1.default.findOne({ email });
        if (!findUser)
            return res.json({
                success: "false",
            });
        const find = yield AuthenticateCode_1.default.find({ email });
        const genCode = (0, res_1.makeid)(6);
        if (find.length == 0) {
            const authenticateCode = new AuthenticateCode_1.default({
                email,
                code: genCode,
            });
            yield authenticateCode.save();
        }
        else {
            const upt = yield AuthenticateCode_1.default.findOneAndUpdate({ email }, {
                code: genCode,
                createAt: (0, moment_1.default)(),
                expireAt: (0, moment_1.default)().add(30, "minutes"),
            });
            console.log("upt", upt);
        }
        (0, res_1.sendEmail)(genCode, email);
        return res.json({
            success: "true",
        });
    }
    catch (err) {
        console.log(err);
        return (0, res_1.error500)(res);
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map