import { Button, Image, message } from "antd";
import groupAPI from "@/apis/groupAPI";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import GroupSliderContents from "./SliderContents/GroupSliderContents";
import { getUrlImage } from "@/util/index";
import SNAvatar from "@/components/SNAvatar";
import SNButton from "@/components/SNButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { setGroup } from "@/store/groupSlice";
import { isEmpty } from "lodash";
import { SocketContext } from "@/service/socket/SocketContext";
const GroupDetail = () => {
  const myProfile = useSelector((state) => state.profile);
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) => state.group);
  const [hiddenButtonJoin, setHiddenButtonJoin] = useState(false);
  const [isInvited, setIsInvited] = useState(false);
  const socket = useContext(SocketContext);
  const fetchGroupDetail = async () => {
    try {
      const res = await groupAPI.getGroupDetail(groupId);
      dispatch(setGroup(res.data.data));
      const group = res.data.data;
      setHiddenButtonJoin(group.isAdmin);
      setIsInvited(
        group.invited.findIndex(
          (inv) => inv.invitedUser._id === myProfile._id
        ) !== -1
      );
    } catch (error) {
      message.error("Get detail group fail!");
    }
  };
  const isRequested = () => {
    return (
      group.requestJoin.findIndex((user) => user._id === myProfile._id) !== -1
    );
  };
  const handleClickBtnJoin = async () => {
    if (group.isMember) {
      await groupAPI.requestLeaveGroup(groupId);
      fetchGroupDetail();
    } else {
      await groupAPI.requestJoinGroup({ groupId, requestJoin: !isRequested() });
      fetchGroupDetail();
    }
  };
  const handleResponseInvite = async (isJoin) => {
    await groupAPI.responeIntiveToGroup({ isJoin, groupId });
    fetchGroupDetail();
    isJoin && message.success(`Welcome to ${group.groupName} group`);
  };

  useEffect(() => {
    socket.on("notification", (msg) => {
      if (msg.type === 2) {
        fetchGroupDetail();
      }
    });
  }, []);
  useEffect(() => {
    fetchGroupDetail();
  }, []);
  return (
    <div className="flex flex-col p-0 lg:px-[4rem] ">
      {!isEmpty(group) && (
        <>
          <div className="shadow-2 pb-[1rem] rounded-xl bg-white">
            <div className="relative">
              <Image
                className="w-[100%] h-[300px] rounded-t-xl object-cover object-center"
                src={getUrlImage(group.cover)}
                fallback="data:image/png;base64,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"
              />
              <div
                className={classNames(
                  "absolute left-0 bottom-[-90px]  w-full flex justify-start pl-[32px] gap-[16px]",
                  {
                    "items-center": hiddenButtonJoin,
                    "items-end ": !hiddenButtonJoin,
                  }
                )}
              >
                <SNAvatar
                  className="border-2 border-gray-300"
                  size={150}
                  src={group.avatar}
                  fullName={group.groupName}
                />
                <div className=" flex flex-col gap-[12px]">
                  <p
                    className={classNames(
                      "text-[1.5rem] font-bold text-color-text leading-[1em]",
                      { "mt-[12px]": group.isAdmin }
                    )}
                  >
                    {group.groupName}
                  </p>
                  {!hiddenButtonJoin &&
                    (!isInvited ? (
                      <Button
                        type="primary"
                        shape="round"
                        onClick={handleClickBtnJoin}
                      >
                        {group.isMember
                          ? "Leave this group"
                          : isRequested()
                          ? "Cancel request"
                          : "Join"}
                      </Button>
                    ) : (
                      <div className="flex gap-[10px]">
                        <Button
                          type="primary"
                          shape="round"
                          onClick={() => handleResponseInvite(true)}
                        >
                          Accept to join group
                        </Button>
                        <Button
                          type="primary"
                          shape="round"
                          onClick={() => handleResponseInvite(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-[52px] px-[32px] ml-auto w-fit-content">
              <div className="flex items-center gap-[60px] ml-auto">
                <div>
                  <p className="text-[1.375rem] uppercase text-center font-bold text-color-text leading-[1em]">
                    <FontAwesomeIcon
                      icon={faEarthAmericas}
                      className=" text-lg text-color-text"
                    />
                  </p>
                  <p className=" text-[0.75rem] mt-[10px] text-color-text-alt-2 uppercase font-bold text-center">
                    {group.isPrivate ? "Private" : "Public"}
                  </p>
                </div>
                <div>
                  <p className="text-[1.375rem] uppercase text-center font-bold text-color-text leading-[1em]">
                    {group.members.length}
                  </p>
                  <p className=" text-[0.75rem] mt-[10px] text-color-text-alt-2 uppercase font-bold text-center">
                    members
                  </p>
                </div>
                <div>
                  <p className="text-[1.375rem] uppercase text-center font-bold text-color-text leading-[1em]">
                    {group.postCount}
                  </p>
                  <p className=" text-[0.75rem] mt-[10px] text-color-text-alt-2 uppercase font-bold text-center">
                    posts
                  </p>
                </div>
              </div>
            </div>
          </div>
          <GroupSliderContents
            isAdmin={group.isAdmin}
            isManager={group.isManager}
          />
        </>
      )}
    </div>
  );
};

export default GroupDetail;
