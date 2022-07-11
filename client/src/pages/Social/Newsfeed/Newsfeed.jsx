import React, { useState } from "react";
import { message, Badge } from "antd";
import postAPI from "@/apis/postAPI";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPostList } from "@/store/postSlice";

import SNWidgetBox from "@/components/SNWidgetBox";
import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";

import groupAPI from "@/apis/groupAPI";
import { Link } from "react-router-dom";
import SNListPost from "@/components/SNListPost";
import userAPI from "@/apis/userAPI";
import { setProfile } from "@/store/profileSlice";

const Newsfeed = () => {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile);
  const [groups, setGroups] = useState([]);

  // const profile = useSelector((state) => state.profile);

  useEffect(() => {
    fetchGroups();
    userAPI.getMyProfile().then((rs) => dispatch(setProfile(rs.data.data)));
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await groupAPI.getAllGroups();
      setGroups(res.data.data);
    } catch (error) {
      message.error("Get group fail!");
    }
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-4 gap-4 mt-[32px] h-full">
        <SNWidgetBox
          title={"Groups"}
          content={
            profile?.groups?.length ? (
              profile.groups.map((item, index) => (
                <Link key={index} to={`/groups/${item._id}`}>
                  <SNWidgetBoxItem
                    srcAvatar={item.avatar}
                    name={item.groupName}
                    description={item?.members?.length + " members"}
                    leftIcon={
                      item.isPrivate ? (
                        <FontAwesomeIcon
                          icon={faLock}
                          className=" text-lg text-color-icon"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faEarthAmericas}
                          className=" text-lg text-color-icon"
                        />
                      )
                    }
                  />
                </Link>
              ))
            ) : (
              <p className="sn-no-result">No result found</p>
            )
          }
        />
        <SNListPost />
        <SNWidgetBox
          title={"Friends"}
          content={
            profile?.friends?.length ? (
              profile?.friends?.map((item, index) => (
                <Link key={index} to={`/profile/${item.user._id}`}>
                  <SNWidgetBoxItem
                    srcAvatar={item.user.avatar}
                    name={
                      <>
                        {item.user.fullName}{" "}
                        <Badge color="#87d068" dot={item.user.isOnline} />
                      </>
                    }
                    description={"@" + item.user.username}
                  />
                </Link>
              ))
            ) : (
              <p className="sn-no-result">No result found</p>
            )
          }
        />
      </div>
    </div>
  );
};
export default Newsfeed;
