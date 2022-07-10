const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const UserNotification = require("../models/UserNotification");
const Group = require("../models/Group");
const RoleGroup = require("../models/RoleGroup");
const PrivilegeGroup = require("../models/PrivilegeGroup");
const { error500, error400 } = require("../util/res");
const verifyToken = require("../middleware/auth");
const { ObjectId } = require("mongodb");
router.get("/", verifyToken, async (req, res) => {
  try {
    const { index = 0, pageSize = 10 } = req.query;
    const groups = await Group.find()
      .skip(index * pageSize)
      .limit(pageSize)
      .populate({ path: "members", select: "fullName avatar id" })
      .populate({ path: "requestJoin", select: "fullName avatar id" })
      .lean();

    for (const gr of groups) {
      const post = await Post.find({ groupId: ObjectId(gr.id) });
      gr.postCount = post ? post.length : 0;
    }

    return res.json({
      success: true,
      data: groups,
    });
  } catch (err) {}
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const rs = await Group.findByIdAndDelete(id);
    await Post.deleteMany({ groupId: ObjectId(id) });
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {}
});

router.get("/getGroupDetail/:id", verifyToken, async (req, res) => {
  try {
    console.log("login ", req.userId);
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.json({
        success: false,
      });
    const groups = await Group.findById(ObjectId(id))
      .populate("adminGroup")
      .populate({
        path: "members.user",
        select:
          "fullName avatar _id coverPicture friends groups username avatar",
      })

      .populate({ path: "members.role", select: "roleName" })
      .populate({
        path: "requestJoin",
        select: "fullName avatar _id coverPicture username avatar",
      })
      .lean();
    for (const mem of groups.members) {
      mem.role.isManager = mem.role.roleName === "manager" ? true : false;
      mem.role.isAdmin = mem.role.roleName === "administrators" ? true : false;
    }
    for (const mem of groups.members) {
      let post = await Post.find({ poster: ObjectId(mem.user._id) });
      mem.postCount = post ? post.length : 0;
      mem.friendCount = mem.user.friends.length;
      mem.groupCount = mem.user.groups.length;
      delete mem.user.friends;
      delete mem.user.groups;
    }
    const post = await Post.find({ groupId: ObjectId(id) });
    groups.postCount = post ? post.length : 0;
    groups.isMember =
      groups.members.findIndex((item) => item.user._id == req.userId) !== -1;
    groups.isAdmin = req.userId == ObjectId(groups.adminGroup._id);
    return res.json({
      success: true,
      data: groups,
    });
  } catch (err) {}
});

router.post("/", verifyToken, async (req, res) => {
  try {
    let data = req.body;
    let roleAdmin = await RoleGroup.findOne({ roleName: "administrators" });
    data = {
      ...data,
      createBy: ObjectId(req.userId),
      updateBy: ObjectId(req.userId),
      adminGroup: ObjectId(req.userId),
      members: [
        {
          user: ObjectId(req.userId),
          role: roleAdmin._id,
        },
      ],
    };
    const group = new Group(data);
    const rs = await group.save();
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    error500(res);
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    let group = await Group.findById(data._id);
    if (!group) {
      return res.json({
        success: false,
      });
    }
    const rs = await Group.findByIdAndUpdate(group._id, data, { new: true });
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    error500(res);
  }
});
router.post("/requestJoinGroup", verifyToken, async (req, res) => {
  try {
    let { groupId, requestJoin } = req.body;
    console.log("groupId", groupId);
    let group = await Group.findById(groupId);
    if (!group) {
      return res.json({
        success: false,
      });
    }
    if (!group.isPrivate) {
      group.members = group.members.filter(
        (m) => m.user.toString() !== req.userId
      );
      let role = await RoleGroup.findOne({ roleName: "member" });
      group.members.push({ user: ObjectId(req.userId), role });
      let rs = await group.save();
      return res.json({
        success: true,
        data: rs,
      });
    }
    let isMember = group.members.find(
      (mems) => mems.user.toString() === req.userId
    );

    if (isMember) {
      return res.json({
        success: false,
        data: "You are already in group",
      });
    }
    if (!requestJoin) {
      group.requestJoin = group.requestJoin.filter(
        (r) => r.toString() !== req.userId
      );
    } else {
      let isInRequestJoin = group.requestJoin.find(
        (user) => user.toString() === req.userId
      );
      if (!isInRequestJoin) {
        group.requestJoin.push(ObjectId(req.userId));
      }
    }
    const rs = await group.save();
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    console.log(err);
    error500(res);
  }
});

router.post("/inviteToGroup", verifyToken, async (req, res) => {
  try {
    const io = req.io;
    let { groupId, userId } = req.body;
    let group = await Group.findById(groupId);
    if (!group) {
      return res.json({
        success: false,
      });
    }
    let isMember = group.members.find(
      (mems) => mem.user.toString() === req.userId
    );
    if (!isMember) {
      return res.json({
        success: false,
        data: "You don't have privilege to do this",
      });
    }
    group.invited.push({
      member: ObjectId(req.userId),
      invitedUser: ObjectId(userId),
    });
    const rs = await group.save();
    const noti = await UserNotification({
      data: group,
      type: 5,
      fromUser: req.userId,
    });
    await noti.save();
    io.sockets.to(`user_${userId}`).emit("notification", {
      data: noti,
    });
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    error500(res);
  }
});

router.post("/responeIntiveToGroup", verifyToken, async (req, res) => {
  try {
    let { isJoin, groupId } = req.body;
    let group = await Group.findById(groupId);
    if (!group) {
      return res.json({
        success: false,
      });
    }
    group.invited = group.invited.filter(
      (i) => i.invitedUser.toString() !== req.userId
    );
    if (isJoin) {
      let roleMember = await RoleGroup.findOne({ roleName: "member" });
      group.members.push({ user: ObjectId(req.userId), role: roleMember._id });
      let usr = await User.findById(req.userId);
      usr.groups = usr.groups.filter((g) => g.toString() !== groupId);
      usr.groups.push(ObjectId(groupId));
      await usr.save();
    }
    let rs = await group.save();
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    error500(res);
  }
});

router.post("/joinGroup", verifyToken, async (req, res) => {
  try {
    let { groupId, userId, isJoin } = req.body;
    const io = req.io;

    console.log("groupId", groupId);
    let group = await Group.findById(groupId);
    if (!group) {
      return res.json({
        success: false,
      });
    }
    ///check Privilege

    let roleMember = await RoleGroup.findOne({ roleName: "member" });
    console.log("roleMember", roleMember);
    if (group.adminGroup.toString() !== req.userId) {
      let privilegeAdmin = await RoleGroup.findOne({
        roleName: "manager",
      });
      let isAdmin = group.members.find(
        (mems) =>
          mem.user.toString() === req.userId &&
          mem.role.toString() === privilegeAdmin._id
      );
      if (!isAdmin) {
        return res.json({
          success: false,
          data: "You don't have privilege to do this",
        });
      }
    }
    group.requestJoin = group.requestJoin.filter(
      (user) => user.toString() !== userId
    );
    if (isJoin) {
      group.members = group.members.filter(
        (mem) => mem.user.toString() !== userId
      );
      group.members.push({ user: ObjectId(userId), role: roleMember._id });
      let usr = await User.findById(userId);
      usr.groups = usr.groups.filter((g) => g.toString() !== groupId);
      usr.groups.push(ObjectId(groupId));
      await usr.save();
      const noti = await UserNotification({
        data: group,
        type: 7,
      });
      await noti.save();
      io.sockets.to(`user_${userId}`).emit("notification", {
        data: noti,
      });
    }
    const rs = await group.save();
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    console.log(err);
    error500(res);
  }
});

router.post("/kickOutOfGroup", verifyToken, async (req, res) => {
  try {
    let { groupId, userId } = req.body;
    console.log("groupId", groupId);
    let group = await Group.findById(groupId);
    if (!group) {
      return res.json({
        success: false,
      });
    }
    ///check Privilege
    if (group.adminGroup.toString() !== req.userId) {
      let privilegeAdmin = await RoleGroup.findOne({
        roleName: "manager",
      });
      let isAdmin = group.members.find(
        (mems) =>
          mem.user.toString() === req.userId &&
          mem.role.toString() === privilegeAdmin._id
      );
      if (!isAdmin) {
        return res.json({
          success: false,
          data: "You don't have privilege to do this",
        });
      }
    }
    group.members = group.members.filter(
      (mem) => mem.user.toString() !== userId
    );
    const rs = await group.save();
    let usr = await User.findById(userId);
    usr.groups = usr.groups.filter((g) => g.toString() !== groupId);
    await usr.save();
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    error500(res);
  }
});
router.get("/requestQuitGroup/:groupId", verifyToken, async (req, res) => {
  try {
    let groupId = req.params.groupId;
    let group = await Group.findById(groupId);
    if (!group) {
      return res.json({
        success: false,
      });
    }
    group.members = group.members.filter(
      (mems) => mems.user.toString() !== req.userId
    );
    const rs = await group.save();
    let usr = await User.findById(req.userId);
    usr.groups = usr.groups.filter((g) => g.toString() !== groupId);
    await usr.save();
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    error500(res);
  }
});

router.post("/role", verifyToken, async (req, res) => {
  try {
    let { name, privilege } = req.body;
    let role = new RoleGroup({ roleName: name, privilege });
    await role.save();
    return res.json({
      success: true,
      data: role,
    });
  } catch (err) {
    error500(res);
  }
});

router.post("/updateRoleMember", verifyToken, async (req, res) => {
  try {
    let { userId, isManager, groupId } = req.body;
    let group = await Group.findById(groupId);
    if (group.adminGroup.toString() !== req.userId) {
      let role = await RoleGroup.findOne({
        roleName: "manager",
      });
      let isAllow = group.members.find(
        (mems) =>
          mems.user.toString() === req.userId &&
          mems.role.toString() === role._id
      );
      if (!isAllow) {
        return res.json({
          success: false,
          data: "You don't have privilege to do this",
        });
      }
    }

    let role = await RoleGroup.findOne({
      roleName: isManager ? "manager" : "member",
    });
    group.members = group.members.map((mem) => {
      if (mem.user.toString() !== userId) return mem;
      mem.role = role;
      return mem;
    });
    let rs = await group.save();
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    error500(res);
  }
});

router.post("/privilege", verifyToken, async (req, res) => {
  try {
    let { privilege } = req.body;
    let rs = new PrivilegeGroup({ privilege });
    await rs.save();
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    error500(res);
  }
});

router.get("/getRoles", verifyToken, async (req, res) => {
  try {
    let rs = await RoleGroup.find()
      .select("-__v")
      .populate({ path: "privilege", select: "-_id -__v" });
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    error500(res);
  }
});

router.get("/getGroupUserJoined/:userId", verifyToken, async (req, res) => {
  try {
    let rs = await Group.find({
      members: {
        $elemMatch: {
          user: Object(req.params.userId),
        },
      },
    })
      .select("members groupName isPrivate avatar groupDescription cover _id")
      .lean();
    rs = rs.map((r) => {
      r.membersCount = r.members.length;
      delete r.members;
      return r;
    });
    for (const gr of rs) {
      const post = await Post.find({ groupId: ObjectId(gr.id) });
      gr.postCount = post ? post.length : 0;
    }
    return res.json({
      success: true,
      data: rs,
    });
  } catch (err) {
    console.log(err);
    error500(res);
  }
});

router.get("/getImages/:id", verifyToken, async (req, res) => {
  try {
    let groupId = req.params.id;
    let group = await Group.findById(groupId);
    let isMember = group.members.find(
      (mems) => mems.user.toString() === req.userId
    );
    if (!isMember) {
      return res.json({
        success: false,
        data: "You are not the member of this group",
      });
    }
    let posts = await Post.find({
      $and: [{ groupId: ObjectId(groupId) }, { attachments: { $ne: [] } }],
    }).sort({ createAt: -1 });
    let listImages = [];
    for (const p of posts) {
      listImages = listImages.concat(p.attachments);
    }
    return res.json({
      success: true,
      data: listImages,
    });
  } catch (err) {}
});

module.exports = router;
