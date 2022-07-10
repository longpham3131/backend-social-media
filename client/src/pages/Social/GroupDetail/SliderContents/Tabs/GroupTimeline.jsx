import SNWidgetBox from "@/components/SNWidgetBox";
import SNPost from "@/components/SNPost";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { Badge } from "antd";

import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import { useParams } from "react-router";
import SNListPost from "@/components/SNListPost";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
const GroupTimeline = () => {
  const group = useSelector((state) => state.group);
  console.log("emty", isEmpty(group));
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

      <SNListPost showButtonCreatePost={group.isMember} />
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
                      <Badge color="#87d068" dot={group.adminGroup.isOnline} />
                    </>
                  }
                  description={"@" + group.adminGroup.username}
                />
              </Link>
            )
          }
        />
        <SNWidgetBox
          title={"Groups"}
          content={<p className="sn-no-result">No groups found</p>}
        />
      </div>
    </>
  );
};
export default GroupTimeline;
