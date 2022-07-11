import { Button, Card, Carousel, Image, message, Modal } from "antd";
import userAPI from "@/apis/userAPI";
import React, { useState, useRef, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import postAPI from "@/apis/postAPI";
import emptyIcon from "@/assets/images/emp.png";
import {
  setPostList,
  editPost,
  deletePost,
  createComment,
  likePost,
} from "@/store/postSlice";
import { setProfile } from "@/store/profileSlice";
import { getUrlImage } from "@/util/index";
import "./PostDetail.scss";
import SNPost from "@/components/SNPost";
import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";
import CreateEditPost from "@/components/SNCreateEditPost";
import { editProfile } from "@/store/profileSlice";
import { SocketContext } from "@/service/socket/SocketContext";
import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import SNPost2 from "@/components/SNPost2";
import classNames from "classnames";
import { getUrlVideo } from "util";
const { confirm } = Modal;

const PostDetail = () => {
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const { postId } = useParams();
  const post = useSelector((state) => state.posts[0]);
  const [hasAtt, setHasAtt] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchPostListByProfile();
  }, [postId]);

  useEffect(() => {
    socket.on("notification", (msg) => {
      if (msg.data.type === 1 || msg.data.type === 2) {
        fetchPostListByProfile();
      }
    });
  }, []);

  const fetchPostListByProfile = async () => {
    console.log(postId);
    try {
      const res = await postAPI.getPostList({
        limitPost: 10,
        index: 0,
        profile: 0,
        postId: postId,
      });
      setHasAtt(res.data[0].attachments.length > 0 ? true : false);
      await dispatch(setPostList(res.data));
    } catch (error) {
      console.log(error);
      message.error("Get posts failed!");
    }
  };

  return (
    <>
      {post ? (
        <div className="flex items-center justify-center h-full">
          <div
            className={classNames("bg-white rounded-xl h-[80%]", {
              " grid grid-cols-3": hasAtt,
            })}
          >
            {hasAtt && (
              <div className="bg-black col-span-2 rounded-tl-xl rounded-bl-xl">
                <Carousel arrows={true}>
                  {post.attachments.map((att, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-center h-full w-full">
                        {att.type === "video/mp4" ? (
                          <video controls key={index}>
                            <source src={getUrlVideo(att.file)} />
                          </video>
                        ) : (
                          <img
                            src={getUrlImage(att.file)}
                            className=" object-cover"
                            alt=""
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
            <div>
              <SNPost2 post={post} />
              {/* <SNWidgetBoxItem srcAvatar={post.poster.avatar} name={post.poster.fullName} description={getAudience(post.audience) + {" "} + } /> */}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col mt-6">
          <WarningOutlined className="WarningOutlined" />
          <div className="flex flex-row items-end">
            <p className="mr-2 text-3xl">No posts found </p>
            <a className="mr-2 text-3xl" href="/">
              Go back to HomePage
            </a>
          </div>
        </div>
      )}
    </>
  );
};
export default PostDetail;
