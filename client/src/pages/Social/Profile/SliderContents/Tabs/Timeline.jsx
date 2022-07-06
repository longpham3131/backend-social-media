import SNWidgetBox from "@/components/SNWidgetBox";
import SNPost from "@/components/SNPost";
import moment from "moment";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  setPostList,
  editPost,
  deletePost,
  createComment,
  likePost,
} from "@/store/postSlice";
import postAPI from "@/apis/postAPI";
import { message, Modal } from "antd";
import CreateEditPost from "@/components/SNCreateEditPost";
const { confirm } = Modal;
const Timeline = ({ user }) => {
  const postList = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [showEditPost, setShowEditPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const refAddEditPost = useRef(null);
  const handleDeletePost = async (postId) => {
    confirm({
      title: "Are you sure you want to delete this post?",
      icon: <ExclamationCircleOutlined />,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk() {
        try {
          postAPI.deletePost(postId);
          dispatch(deletePost(postId));
          message.success("Success!");
        } catch {
          message.error("Failed!");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
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
  const handleComment = async (values) => {
    try {
      const res = await postAPI.comment(values);
      const dataDispatchStore = {
        ...res.data.data,
        user: {
          _id: user._id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar,
        },
      };
      dispatch(
        createComment({ postId: values.postId, comment: dataDispatchStore })
      );
      console.log("success", res.data);
    } catch {
      message.error("Failed!");
    }
  };
  const handleLikePost = async (postId) => {
    try {
      const res = await postAPI.likePost(postId);
      dispatch(likePost(res.data));
    } catch {
      message.error("Failed");
    }
  };
  const handleEditPost = async (values) => {
    values.postId = selectedPostId;
    console.log("success", values);
    try {
      const res = await postAPI.editPost(values);
      console.log("success", res.data);
      dispatch(editPost(res.data));
      message.success("Success!");
      refAddEditPost.current.resetFields();
      setShowEditPost(false);
    } catch {
      message.error("Edit post failed");
    }
  };
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
      </div>

      <div className=" col-span-2">
        {postList.map((post) => (
          <SNPost
            post={post}
            key={post._id}
            onDelete={handleDeletePost}
            onEdit={showEdit}
            onCommentPost={handleComment}
            onLike={handleLikePost}
          />
        ))}
      </div>
      <CreateEditPost
        ref={refAddEditPost}
        visible={showEditPost}
        title="Edit post"
        okText="Update"
        onClose={() => setShowEditPost(false)}
        onSubmit={handleEditPost}
      />
    </>
  );
};
export default Timeline;
