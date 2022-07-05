const express = require("express");
const router = express.Router();
const User = require("../models/User");
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
    const groups = await Group.find().skip(index * pageSize).limit(pageSize)
      .populate({ path: "members", select: "fullName avatar id" })
      .populate({ path: "requestJoin", select: "fullName avatar id" }).lean()
    return res.json({
      success: true,
      data: groups
    });
  }
  catch (err) {

  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    let data = req.body;
    data = { ...data, createBy: ObjectId(req.userId), updateBy: ObjectId(req.userId), adminGroup: ObjectId(req.userId) }
    const group = new Group(data)
    const rs = await group.save()
    return res.json({
      success: true,
      data: rs
    });
  }
  catch (err) {

    error500(res)
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    let group = await Group.findById(data._id)
    if (!group) {
      return res.json({
        success: false
      })
    }
    const rs = await Group.findByIdAndUpdate(group._id, data, { new: true })
    return res.json({
      success: true,
      data: rs
    });
  }
  catch (err) {
    error500(res)
  }
});
router.get("/requestJoinGroup/:groupId", verifyToken, async (req, res) => {
  try {
    let groupId = req.params.groupId;
    console.log('groupId', groupId)
    let group = await Group.findById(groupId)
    if (!group) {
      return res.json({
        success: false
      })
    }
    let isMember = group.members.find(mems => mems.user.toString() === req.userId)
    if (isMember) {
      return res.json({
        success: false,
        data: "You are already in group"
      })
    }
    let isInRequestJoine = group.requestJoin.find(user => user.toString() === req.userId)
    if (!isInRequestJoine) {
      group.requestJoin.push(ObjectId(req.userId))
    }
    const rs = await group.save()
    return res.json({
      success: true,
      data: rs
    });
  }
  catch (err) {

    error500(res)
  }
});


router.post("/inviteToGroup", verifyToken, async (req, res) => {
  try {
    const io = req.io;
    let { groupId, userId } = req.body;
    let group = await Group.findById(groupId)
    if (!group) {
      return res.json({
        success: false
      })
    }
    let isMember = group.members.find(mems =>
      mem.user.toString() === req.userId)
    if (!isMember) {
      return res.json({
        success: false,
        data: "You don't have privilege to do this"
      })
    }
    group.invited.push({ member: ObjectId(req.userId), invitedUser: ObjectId(userId) })
    const rs = await group.save()
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
      data: rs
    });
  }
  catch (err) {
    error500(res)
  }
});

router.post("/responeIntiveToGroup", verifyToken, async (req, res) => {
  try {
    let { isJoin, groupId } = req.body
    let group = await Group.findById(groupId)
    if (!group) {
      return res.json({
        success: false
      })
    }
    group.invited = group.invited.filter(i => i.invitedUser.toString() !== req.userId)
    if (isJoin) {
      let roleMember = await RoleGroup.findOne({ roleName: "member" })
      group.members.push({ user: ObjectId(req.userId), role: roleMember._id })
    }
    let rs = await group.save()
    return res.json({
      success: true,
      data: rs
    });
  }
  catch (err) {
    error500(res)
  }
})

router.post("/joinGroup", verifyToken, async (req, res) => {
  try {
    let { groupId, userId } = req.body;


    console.log('groupId', groupId)
    let group = await Group.findById(groupId)
    if (!group) {
      return res.json({
        success: false
      })
    }
    ///check Privilege

    let roleMember = await RoleGroup.findOne({ roleName: "member" })
    console.log("roleMember", roleMember)
    if (group.adminGroup.toString() !== req.userId) {
      let privilegeAdmin = await RoleGroup.findOne({ roleName: "administrators" })
      let isAdmin = group.members.find(mems =>
        mem.user.toString() === req.userId && mem.role.toString() === privilegeAdmin._id)
      if (!isAdmin) {
        return res.json({
          success: false,
          data: "You don't have privilege to do this"
        })
      }
    }
    group.requestJoin = group.requestJoin.filter(user => user.toString() !== userId)
    group.members = group.members.filter(mem => mem.user.toString() !== userId)
    group.members.push({ user: ObjectId(userId), role: roleMember._id })

    const rs = await group.save()
    return res.json({
      success: true,
      data: rs
    });
  }
  catch (err) {
    error500(res)
  }
});

router.post("/kickOutOfGroup", verifyToken, async (req, res) => {
  try {
    let { groupId, userId } = req.body;
    console.log('groupId', groupId)
    let group = await Group.findById(groupId)
    if (!group) {
      return res.json({
        success: false
      })
    }
    ///check Privilege
    if (group.adminGroup.toString() !== req.userId) {
      let privilegeAdmin = await RoleGroup.findOne({ roleName: "administrators" })
      let isAdmin = group.members.find(mems =>
        mem.user.toString() === req.userId && mem.role.toString() === privilegeAdmin._id)
      if (!isAdmin) {
        return res.json({
          success: false,
          data: "You don't have privilege to do this"
        })
      }
    }
    group.members = group.members.filter(mem => mem.user.toString() !== userId)
    const rs = await group.save()
    return res.json({
      success: true,
      data: rs
    });
  }
  catch (err) {
    error500(res)
  }
});
router.get("/requestQuitGroup/:groupId", verifyToken, async (req, res) => {
  try {
    let groupId = req.params.groupId;
    console.log('groupId', groupId)
    let group = await Group.findById(groupId)
    if (!group) {
      return res.json({
        success: false
      })
    }
    group.members = group.members.filter(mems => mems.user.toString() !== req.userId)
    const rs = await group.save()
    return res.json({
      success: true,
      data: rs
    });
  }
  catch (err) {
    error500(res)
  }
});

router.post("/role", verifyToken, async (req, res) => {
  try {
    let { name, privilege } = req.body;
    let role = new RoleGroup({ roleName: name, privilege })
    await role.save()
    return res.json({
      success: true,
      data: role
    });
  }
  catch (err) {
    error500(res)
  }
});

router.post("/updateRoleMember", verifyToken, async (req, res) => {
  try {
    let { userId, roleId, groupId } = req.body;
    let group = await Group.findById(groupId)
    let privilege = await RoleGroup.findById(roleId)
    group.members = group.members.map(mem => {
      if (mem.user.toString() !== userId)
        return mem
      mem.role = privilege
      return mem
    })
    let rs = await group.save()
    return res.json({
      success: true,
      data: rs
    });
  }
  catch (err) {
    error500(res)
  }
});

router.post("/privilege", verifyToken, async (req, res) => {
  try {
    let { privilege } = req.body;
    let rs = new PrivilegeGroup({ privilege })
    await rs.save()
    return res.json({
      success: true,
      data: rs
    });
  }
  catch (err) {
    error500(res)
  }
});

router.get("/getRoles", verifyToken, async (req, res) => {
  try {
    let rs = await RoleGroup.find().select("-__v").populate({ path: 'privilege', select: "-_id -__v", })
    return res.json({
      success: true,
      data: rs
    });
  }
  catch (err) {
    error500(res)
  }
});



module.exports = router;
