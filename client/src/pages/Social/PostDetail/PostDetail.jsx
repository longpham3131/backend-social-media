import { Button, Card, Image, message, Modal } from "antd";
import userAPI from "@/apis/userAPI";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import postAPI from "@/apis/postAPI";
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
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CreateEditPost from "@/components/SNCreateEditPost";
import { editProfile } from "@/store/profileSlice";
const { confirm } = Modal;

const PostDetail = () => {
  const myProfile = useSelector((state) => state.profile);
  const postList = useSelector((state) => state.posts[0]);
  const dispatch = useDispatch();
  const { postId } = useParams();
  const [showEditPost, setShowEditPost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const refAddEditPost = useRef(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPostListByProfile();
  }, [postId]);

  const fetchPostListByProfile = async () => {
    console.log(postId)
    try {
      const postList = await postAPI.getPostList({
        limitPost: 10,
        index: 0,
        profile: 0,
        postId: postId,
      });
      await dispatch(setPostList(postList.data));
    } catch (error) {
      console.log(error)
      message.error("Lấy bài viết thất bại!");
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
  const handleDeletePost = async (postId) => {
    confirm({
      title: "Bạn chắc chắn muốn xóa bài viết này?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xác nhận xóa",
      cancelText: "Hủy",
      onOk() {
        try {
          postAPI.deletePost(postId);
          history.push("/");
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

  const handleLikePost = async (postId) => {
    try {
      const res = await postAPI.likePost(postId);
      dispatch(likePost(res.data));
    } catch {
      message.error("Thích bài viết thất bại");
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
      {postList && (
        <SNPost
          post={postList}
          onDelete={handleDeletePost}
          onEdit={showEdit}
          onCommentPost={handleComment}
          onLike={handleLikePost}
        ></SNPost>
      )}
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
export default PostDetail;
