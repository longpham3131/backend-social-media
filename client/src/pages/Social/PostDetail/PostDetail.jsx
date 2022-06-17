import { Button, Card, Image, message, Modal } from "antd";
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
const { confirm } = Modal;

const PostDetail = () => {
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state.profile);
  const postList = useSelector((state) => state.posts[0]);
  const dispatch = useDispatch();
  const { postId } = useParams();
  const [showEditPost, setShowEditPost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const refAddEditPost = useRef(null);
  const [post, setPost] = useState(null);
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
      const postList = await postAPI.getPostList({
        limitPost: 10,
        index: 0,
        profile: 0,
        postId: postId,
      });
      await dispatch(setPostList(postList.data));
    } catch (error) {
      console.log(error);
      message.error("Get posts failed!");
    }
  };

  const handleEditPost = async (values) => {
    values.postId = selectedPostId;
    console.log("success", values);
    try {
      const res = await postAPI.editPost(values);
      console.log("success", res.data);
      dispatch(editPost(res.data));
      message.success("Edit post successfully!");
      refAddEditPost.current.resetFields();
      setShowEditPost(false);
    } catch {
      message.error("Edit post failed!");
    }
  };

  const handleComment = async (values) => {
    try {
      const res = await postAPI.comment(values);
      const dataDispatchStore = {
        ...res.data.data,
        user: {
          _id: myProfile._id,
          username: myProfile.username,
          fullName: myProfile.fullName,
          avatar: myProfile.avatar,
        },
      };
      dispatch(
        createComment({ postId: values.postId, comment: dataDispatchStore })
      );
      console.log("success", res.data);
    } catch {
      message.error("Post comment failed!");
    }
  };
  const handleDeletePost = async (postId) => {
    confirm({
      title: "Do you want to delete this post?",
      icon: <ExclamationCircleOutlined />,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk() {
        try {
          postAPI.deletePost(postId);
          dispatch(deletePost(postId));
          navigate("/");
          message.success("Post deleted successfully!");
        } catch (err) {
          console.log(err);
          message.error("Failed!");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await postAPI.likePost(postId);
      dispatch(likePost(res.data));
    } catch {
      message.error("Failed");
    }
  };

  const showEdit = async (post) => {
    await refAddEditPost.current.setFields(
      post.audience,
      post.text,
      post.attachments[0]
    );
    setShowEditPost(true);
    setSelectedPostId(post._id);
  };
  return (
    <div className="flex flex-col px-[4rem] profile-user h-full overflow-auto section--hidden-scroll-y">
      {postList ? (
        <SNPost
          post={postList}
          onDelete={handleDeletePost}
          onEdit={showEdit}
          onCommentPost={handleComment}
          onLike={handleLikePost}
        ></SNPost>
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
      <CreateEditPost
        ref={refAddEditPost}
        visible={showEditPost}
        title="Edit post"
        okText="Save"
        onClose={() => setShowEditPost(false)}
        onSubmit={handleEditPost}
      />
    </div>
  );
};
export default PostDetail;
