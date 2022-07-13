import SNWidgetBox from "@/components/SNWidgetBox";
import SNPost from "@/components/SNPost";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  editPost,
  deletePost,
  createComment,
  likePost,
} from "@/store/postSlice";
import postAPI from "@/apis/postAPI";
import { message, Modal } from "antd";
import CreateEditPost from "@/components/SNCreateEditPost";
import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import { useParams } from "react-router";
import userAPI from "@/apis/userAPI";
import SNImage from "@/components/SNImage";
import SNPost2 from "@/components/SNPost2";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import groupAPI from "@/apis/groupAPI";
import SNListPost from "@/components/SNListPost";
const Timeline = ({ user }) => {
  const postList = useSelector((state) => state.posts);
  const myProfile = useSelector((state) => state.profile);
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [groups, setGroups] = useState([]);
  const fetchAllImage = async () => {
    try {
      const res = await userAPI.getImageUser(userId);
      setPhotos(res.data.data);
    } catch (erorr) {
      console.log("error get image");
    }
  };
  const fetchGroups = async () => {
    try {
      const res = await groupAPI.getGroupJoinedByUserId(userId);
      setGroups(res.data.data);
    } catch (error) {
      message.error("Get group fail!");
    }
  };
  useEffect(() => {
    fetchAllImage();
    fetchGroups();
  }, [userId]);

  return (
    <>
      <div className="flex flex-col gap-[16px]">
        <SNWidgetBox
          title={"About Me"}
          content={
            <>
              <p>Welcome to my profile!</p>
              <div className="flex flex-col gap-[14px]">
                <div className="flex flex-col gap-[10px] justify-between">
                  <p className=" text-color-text-alt">Joined</p>
                  <p>{moment(user.createAt).format("MMMM Do YYYY")}</p>
                </div>
                <div className="flex flex-col gap-[10px] justify-between">
                  <p className=" text-color-text-alt">From</p>
                  <p>
                    {user?.address
                      ? user?.address?.district + ", " + user?.address?.province
                      : "No results found"}
                  </p>
                </div>
              </div>
            </>
          }
        />
        <SNWidgetBox
          title={"Friends"}
          content={
            user?.friends.length > 0 ? (
              user?.friends.map((item, index) => (
                <Link key={index} to={`/profile/${item.user._id}`}>
                  <SNWidgetBoxItem
                    srcAvatar={item.user.avatar}
                    name={item.user.fullName}
                    description={`@${item.user.username}`}
                  />
                </Link>
              ))
            ) : (
              <p className="sn-no-result">No friends found</p>
            )
          }
        />
      </div>

      {/* <div className=" col-span-2">
        {postList.length ? (
          postList.map((post) => <SNPost2 post={post} key={post._id} />)
        ) : (
          <p className="sn-no-result">No post found</p>
        )}
      </div> */}
      <SNListPost showButtonCreatePost={userId === myProfile._id} />
      <div className="flex flex-col gap-[16px]">
        <SNWidgetBox
          title={"Photos"}
          content={
            photos.length ? (
              <div className="grid grid-cols-4 gap-[2px]">
                {photos.map((item, index) => (
                  <SNImage media={item} key={index} isHiddenOverlay={true} />
                ))}
              </div>
            ) : (
              <p className="sn-no-result">No photos found</p>
            )
          }
        />
        <SNWidgetBox
          title={"Groups"}
          content={
            groups.length > 0 ? (
              groups.map((item, index) => (
                <Link key={index} to={`/groups/${item._id}`}>
                  <SNWidgetBoxItem
                    srcAvatar={item.avatar}
                    name={item.groupName}
                    description={item.membersCount + " members"}
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
              <p className="sn-no-result">No groups found</p>
            )
          }
        />
      </div>
    </>
  );
};
export default Timeline;
