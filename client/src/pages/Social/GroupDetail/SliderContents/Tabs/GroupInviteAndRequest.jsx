import { Input, message, Tabs } from "antd";
import SNWidgetBox from "@/components/SNWidgetBox";
import React from "react";
import groupAPI from "@/apis/groupAPI";
import { useParams } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import {
  SendOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  StarFilled,
  StarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { editGroup } from "@/store/groupSlice";
import { useSelector } from "react-redux";
import { setGroup } from "@/store/groupSlice";
const { TabPane } = Tabs;
const { Search } = Input;
const GroupInviteAndRequest = () => {
  const onSearch = () => {};
  const group = useSelector((state) => state.group);
  const { groupId } = useParams();
  const myProfile = useSelector((state) => state.profile);
  const [userList, setUserList] = useState([]);
  const dispatch = useDispatch();
  const fetchUserWithoutGroup = async () => {
    const rs = await groupAPI.getUserWithoutGroup(groupId);
    setUserList(rs.data.data);
  };
  const handleInvite = async ({ _id, fullName, avatar, username }) => {
    await groupAPI.inviteUser({ groupId, userId: _id, isInvite: true });
    dispatch(
      editGroup({
        invited: [
          ...group.invited,
          {
            member: { fullName: myProfile.fullName },
            invitedUser: { _id, fullName, avatar, username },
          },
        ],
      })
    );
    const filterUserList = userList.filter((user) => user._id !== _id);
    setUserList(filterUserList);
    message.success(`Invite user ${fullName} success!`);
  };
  const handleCancelInvite = async ({ _id, fullName, avatar, username }) => {
    await groupAPI.inviteUser({ groupId, userId: _id, isInvite: false });
    dispatch(
      editGroup({
        invited: group.invited.filter((user) => user.invitedUser._id !== _id),
      })
    );
    const filterUserList = [...userList, { _id, fullName, avatar, username }];
    setUserList(filterUserList);
    message.success(`Cancel invite user ${fullName} success!`);
  };
  const handleAcceptOrDeleteRequest = async (user, isJoin) => {
    await groupAPI.responseRequestJoin({ groupId, userId: user._id, isJoin });
    const res = await groupAPI.getGroupDetail(groupId);
    dispatch(setGroup(res.data.data));
    isJoin
      ? message.success(`Welcome ${user.fullName} to become a member`)
      : message.success(`Cancel ${user.fullName} request success `);
  };
  const handleKickUser = async (userId) => {
    await groupAPI.kickMember({ userId, groupId });
    const res = await groupAPI.getGroupDetail(groupId);
    dispatch(setGroup(res.data.data));
    message.success(`Delete success!`);
  };
  const handleUpdateRole = async (userId, isRoleCurrent) => {
    await groupAPI.updateRole({ userId, groupId, isManager: !isRoleCurrent });
    const res = await groupAPI.getGroupDetail(groupId);
    dispatch(setGroup(res.data.data));
    message.success(`Update role success!`);
  };
  useEffect(() => {
    fetchUserWithoutGroup();
  }, []);
  return (
    <div className="col-span-4 ">
      <Tabs defaultActiveKey="1" tabPosition={"left"}>
        <TabPane tab={"Manage member"} key={"manage"}>
          <SNWidgetBox
            title={"Manage member"}
            content={
              <div className="flex flex-col gap-[10px]">
                <Search placeholder="Search user by name" onSearch={onSearch} />
                {group.members.length > 1 ? (
                  group.members.map(
                    (mem, index) =>
                      !mem.role.isAdmin && (
                        <div
                          key={mem.user._id}
                          className="flex justify-between items-center"
                        >
                          <SNWidgetBoxItem
                            srcAvatar={mem.user.avatar}
                            name={mem.user.fullName}
                            description={mem.role.roleName}
                          />
                          <div className="flex gap-[10px]">
                            {mem.role.isManager ? (
                              <StarFilled
                                className=" cursor-pointer text-yellow-300"
                                onClick={() =>
                                  handleUpdateRole(
                                    mem.user._id,
                                    mem.role.isManager
                                  )
                                }
                              />
                            ) : (
                              <StarOutlined
                                className=" cursor-pointer "
                                onClick={() =>
                                  handleUpdateRole(
                                    mem.user._id,
                                    mem.role.isManager
                                  )
                                }
                              />
                            )}
                            <DeleteOutlined
                              className=" cursor-pointer "
                              onClick={() => handleKickUser(mem.user._id)}
                            />
                            {/* <CheckCircleOutlined
                              className=" cursor-pointer "
                              onClick={() => handleKickUser(mem.user._id)}
                            /> */}
                          </div>
                        </div>
                      )
                  )
                ) : (
                  <p className="sn-no-result">No result found</p>
                )}
              </div>
            }
          />
        </TabPane>
        <TabPane tab={"Requests list"} key={"requests"}>
          <SNWidgetBox
            title={"Requests list"}
            content={
              <div className="flex flex-col gap-[10px]">
                <Search placeholder="Search user by name" onSearch={onSearch} />
                {group.requestJoin.length ? (
                  group.requestJoin.map((user, index) => (
                    <div
                      key={user._id}
                      className="flex justify-between items-center"
                    >
                      <SNWidgetBoxItem
                        srcAvatar={user.avatar}
                        name={user.fullName}
                        description={"@" + user.username}
                      />
                      <div className="flex gap-[10px]">
                        <CheckCircleOutlined
                          className=" cursor-pointer "
                          onClick={() =>
                            handleAcceptOrDeleteRequest(user, true)
                          }
                        />
                        <CloseCircleOutlined
                          className=" cursor-pointer "
                          onClick={() =>
                            handleAcceptOrDeleteRequest(user, false)
                          }
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="sn-no-result">No result found</p>
                )}
              </div>
            }
          />
        </TabPane>
        <TabPane tab={"Invited list"} key={"invited"}>
          <SNWidgetBox
            title={"Invited list"}
            content={
              <div className="flex flex-col gap-[10px]">
                <Search placeholder="Search user by name" onSearch={onSearch} />
                {group.invited.length ? (
                  group.invited.map((user, index) => (
                    <div
                      key={user.invitedUser._id}
                      className="flex justify-between items-center"
                    >
                      <SNWidgetBoxItem
                        srcAvatar={user.invitedUser.avatar}
                        name={user.invitedUser.fullName}
                        description={"invited by " + user.member.fullName}
                      />
                      <CloseCircleOutlined
                        className=" cursor-pointer "
                        onClick={() => handleCancelInvite(user.invitedUser)}
                      />
                    </div>
                  ))
                ) : (
                  <p className="sn-no-result">No result found</p>
                )}
              </div>
            }
          />
        </TabPane>
        <TabPane tab={"Invite user"} key={"invite"}>
          <SNWidgetBox
            title={"Invite user"}
            content={
              <div className="flex flex-col gap-[10px]">
                <Search placeholder="Search user by name" onSearch={onSearch} />
                {userList.length ? (
                  userList.map((user) => (
                    <div
                      key={user._id}
                      className="flex justify-between items-center"
                    >
                      <SNWidgetBoxItem
                        srcAvatar={user.avatar}
                        name={user.fullName}
                        description={"@" + user.username}
                      />
                      <SendOutlined
                        className=" cursor-pointer "
                        onClick={() => handleInvite(user)}
                      />
                    </div>
                  ))
                ) : (
                  <p className="sn-no-result">No result found</p>
                )}
              </div>
            }
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default GroupInviteAndRequest;
