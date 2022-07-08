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

const Timeline = ({ user }) => {
  const postList = useSelector((state) => state.posts);
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const fetchAllImage = async () => {
    try {
      const res = await userAPI.getImageUser(userId);
      setPhotos(res.data.data);
    } catch (erorr) {
      console.log("error get image");
    }
  };
  useEffect(() => {
    fetchAllImage();
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
                <div className="flex justify-between">
                  <p className=" text-color-text-alt">Joined</p>
                  <p>{moment(user.createAt).format("MMMM Do YYYY")}</p>
                </div>
                <div className="flex justify-between">
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
        />
      </div>

      <div className=" col-span-2">
        {postList.length ? (
          postList.map((post) => <SNPost2 post={post} key={post._id} />)
        ) : (
          <p className="sn-no-result">No post found</p>
        )}
      </div>
      <div className="flex flex-col gap-[16px]">
        <SNWidgetBox
          title={"Photos"}
          content={
            photos.length ? (
              <div className="grid grid-cols-4 gap-[2px]">
                {photos.map((item, index) => (
                  <SNImage
                    urlImage={item.filePath}
                    key={index}
                    isHiddenOverlay={true}
                  />
                ))}
              </div>
            ) : (
              <p className="sn-no-result">No photos found</p>
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
export default Timeline;
