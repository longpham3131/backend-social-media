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
const argon2_1 = __importDefault(require("argon2"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const res_1 = require("../../util/res");
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield User.findOne({ username });
        if (!user)
            return (0, res_1.error400)(res, "Wrong Username or Password");
        const passwordValid = yield argon2_1.default.verify(user.password, password);
        if (!passwordValid)
            return (0, res_1.error400)(res, "Wrong Username or Password");
        const date = new Date();
        date.setDate(date.getDate() + 300000);
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, expired: date }, process.env.ACCESS_TOKEN_SECRET);
        res.json({
            accessToken,
        });
    }
    catch (error) {
        console.log(error);
        return (0, res_1.error500)(res);
    }
}));
module.exports = router;
//# sourceMappingURL=login.js.map