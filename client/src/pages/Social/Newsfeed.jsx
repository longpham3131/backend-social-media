import React, { useRef, useState } from "react";
import { message, Modal } from "antd";
import postAPI from "@/apis/postAPI";
import SNPost from "@/components/SNPost";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPostList,
  deletePost,
  editPost,
  createComment,
} from "@/store/postSlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import CreateEditPost from "@/components/SNCreateEditPost";

const { confirm } = Modal;

const Newsfeed = () => {
  const dispatch = useDispatch();
  const postList = useSelector((state) => state.posts);
  const profile = useSelector((state) => state.profile);
  const [showEditPost, setShowEditPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const refAddEditPost = useRef(null);
  // const profile = useSelector((state) => state.profile);
  useEffect(() => {
    fetchPostList();
  }, []);

  const fetchPostList = async () => {
    try {
      const postList = await postAPI.getPostList({
        limitPost: 10,
        index: 0,
      });
      await dispatch(setPostList(postList.data));
    } catch (error) {
      message.error("Lấy danh sách bài viết thất bại!");
    }
  };
  const handleEditPost = async (values) => {
    values.postId = selectedPostId;
    console.log("success", values);
    try {
      const res = await postAPI.editPost(values);
      console.log("success", res.data);
      dispatch(editPost(res.data));
      message.success("Chỉnh sửa bài viết thành công.");
      refAddEditPost.current.resetFields();
      setShowEditPost(false);
    } catch {
      message.error("Chỉnh sửa bài viết thất bại!");
    }
  };
  const handleDeletePost = async (postId) => {
    confirm({
      title: "Bạn chắc chắn muốn xóa bài viết này?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xác nhận xóa",
      cancelText: "Hủy",
      onOk() {
        try {
          postAPI.deletePost(postId);
          dispatch(deletePost(postId));
          message.success("Xóa bài viết thành công.");
        } catch {
          message.error("Xóa bài viết thất bại!");
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
          _id: profile._id,
          username: profile.username,
          fullName: profile.fullName,
          avatar: profile.avatar,
        },
      };
      dispatch(
        createComment({ postId: values.postId, comment: dataDispatchStore })
      );
      console.log("success", res.data);
    } catch {
      message.error("Đăng bình luận thất bại!");
    }
  };
  return (
    <div className="h-full overflow-auto section--hidden-scroll-y">
      {postList.map((post) => (
        <SNPost
          post={post}
          key={post._id}
          onDelete={handleDeletePost}
          onEdit={showEdit}
          onCommentPost={handleComment}
        />
      ))}
      <CreateEditPost
        ref={refAddEditPost}
        visible={showEditPost}
        title="Chỉnh sửa bài viết"
        okText="Lưu chỉnh sửa"
        onClose={() => setShowEditPost(false)}
        onSubmit={handleEditPost}
      />
    </div>
  );
};
export default Newsfeed;
