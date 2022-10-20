import { model, Schema } from 'mongoose';
import { IUser } from '../models/user.interface';

const UserSchema = new Schema<IUser>(
  {
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
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
    ],

    friends: [
      {
        user: {
          type: Schema.Types.ObjectId,
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
          type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

export default model("User", UserSchema);
