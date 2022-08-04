import SNWidgetBox from "@/components/SNWidgetBox";
import SNPost from "@/components/SNPost";
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { Badge, Button } from "antd";

import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import { useParams } from "react-router";
import SNListPost from "@/components/SNListPost";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import groupAPI from "@/apis/groupAPI";
import SNImage from "@/components/SNImage";
import classNames from "classnames";
import { SocketContext } from "@/service/socket/SocketContext";
const GroupTimeline = ({ changeTab }) => {
  const group = useSelector((state) => state.group);
  const [images, setImages] = useState([]);
  const socket = useContext(SocketContext);
  const fetchImageGroup = async () => {
    const res = await groupAPI.getImagesGroup(group._id);
    setImages(res.data.data);
  };
  useEffect(() => {
    socket.on("notification", (msg) => {
      if (msg.type === 2) {
        fetchImageGroup();
      }
    });
  }, []);
  useEffect(() => {
    fetchImageGroup();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-[16px]">
        <SNWidgetBox
          title={"Group Info"}
          content={
            <>
              <p>{group.groupDescription}</p>
              <div className="flex flex-col gap-[14px]">
                <div className="flex justify-between">
                  <p className=" text-color-text-alt">Created</p>
                  <p>{moment(group.createAt).format("MMMM Do YYYY")}</p>
                </div>
                <div className="flex justify-between">
                  <p className=" text-color-text-alt">Type</p>
                  <p>{group?.isPrivate ? "Private" : "Public"}</p>
                </div>
              </div>
            </>
          }
        />
        {/* <SNWidgetBox
          title={"Friends"}
          content={
            user?.friends.length > 0 ? (
              user?.friends.map((item, index) => (
                <SNWidgetBoxItem
                  key={index}
                  srcAvatar={item.user.avatar}
                  name={item.user.fullName}
                  description={`@${item.user.username}`}
                />
              ))
            ) : (
              <p className="sn-no-result">No friends found</p>
            )
          }
        /> */}
      </div>
      {group.isMember ? (
        <SNListPost showButtonCreatePost={group.isMember} />
      ) : (
        <p className="sn-no-result col-span-2">
          Please become a member to view posts
        </p>
      )}

      <div className="flex flex-col gap-[16px]">
        <SNWidgetBox
          title={"Group Administrators"}
          content={
            !isEmpty(group) && (
              <Link to={`/profile/${group.adminGroup._id}`}>
                <SNWidgetBoxItem
                  srcAvatar={group.adminGroup.avatar}
                  name={
                    <>
                      {group.adminGroup.fullName}{" "}
                      <Badge
                        color={
                          group.adminGroup.isOnline ? "#87d068" : "#bfbdbd"
                        }
                        dot={group.adminGroup.isOnline}
                      />
                    </>
                  }
                  description={"@" + group.adminGroup.username}
                />
              </Link>
            )
          }
        />
        <SNWidgetBox
          title={"Media"}
          content={
            images.length ? (
              <div className="grid grid-cols-4 gap-[2px]">
                {images.map((item, index) => (
                  <div
                    key={index}
                    className={classNames({ hidden: index > 11 })}
                  >
                    <SNImage media={item} key={index} isHiddenOverlay={true} />
                  </div>
                ))}
                <Button
                  className={classNames("col-span-4 mt-[15px]", {
                    hidden: images.length <= 12,
                  })}
                  type="primary"
                  shape="round"
                  onClick={() => changeTab("2")}
                >
                  See more
                </Button>
              </div>
            ) : (
              <p className="sn-no-result">No photos found</p>
            )
          }
        />
      </div>
    </>
  );
};
export default GroupTimeline;
