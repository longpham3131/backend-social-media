"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        min: 8,
        max: 20,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    dateOfBirth: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "viking_uewep5.png",
    },
    coverPicture: {
        type: String,
        default: "5f6d2f8173860-bp-cover-image_gw7shw.jpg",
    },
    imageList: {
        default: [String],
    },
    groups: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Group",
        },
    ],
    friends: [
        {
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
            createAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    friendsRequest: [
        {
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
            createAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    interests: [
        {
            title: {
                type: String,
            },
            context: {
                type: String,
            },
        },
    ],
    address: {
        district: {
            type: String,
        },
        province: {
            type: String,
        },
    },
    birthplace: {
        district: {
            type: String,
            default: "",
        },
        province: {
            type: String,
            default: "",
        },
    },
    facebook: {
        type: String,
        default: "",
    },
    insta: {
        type: String,
        default: "",
    },
    twitter: {
        type: String,
        default: "",
    },
    occupation: {
        type: String,
        default: "",
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Number,
        default: 1,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", UserSchema);
//# sourceMappingURL=User.js.map