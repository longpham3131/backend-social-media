import React, { useRef, useState } from "react";
import { message, Modal, Skeleton, Divider } from "antd";
import postAPI from "@/apis/postAPI";
import SNPost from "@/components/SNPost";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPostList,
  deletePost,
  editPost,
  createComment,
  likePost,
  addMorePost,
} from "@/store/postSlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CreateEditPost from "@/components/SNCreateEditPost";
import InfiniteScroll from "react-infinite-scroll-component";
const { confirm } = Modal;

const Newsfeed = () => {
  const dispatch = useDispatch();
  const postList = useSelector((state) => state.posts);
  const profile = useSelector((state) => state.profile);
  const [showEditPost, setShowEditPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const refAddEditPost = useRef(null);
  const [loadMore, setLoadMore] = useState(true);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  // const profile = useSelector((state) => state.profile);
  useEffect(() => {
    fetchPostList();
  }, []);

  useEffect(() => {
    console.log(postList);
  }, [postList]);

  const fetchPostList = async () => {
    try {
      const postList = await postAPI.getPostList({
        limitPost: 6,
        index: 0,
      });
      await dispatch(setPostList(postList.data));
    } catch (error) {
      console.log(error);
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
  const handleLikePost = async (postId) => {
    try {
      const res = await postAPI.likePost(postId);
      dispatch(likePost(res.data));
    } catch {
      message.error("Thích bài viết thất bại");
    }
  };

  const loadMoreData = () => {
    console.log("loadmore");
    if (loading) {
      return;
    }
    setLoading(true);
    postAPI
      .getPostList({
        limitPost: 6,
        index: index + 1,
      })
      .then((postList) => {
        console.log(postList.data.length == 0);
        if (postList.data == 0) {
          setLoadMore(false);
          return;
        }
        setIndex(index + 1);
        dispatch(addMorePost(postList.data));
        setLoading(false);
      });
  };

  return (
    <div
      id="scrollablePost"
      className="h-full overflow-auto section--hidden-scroll-y py-[2.4rem] px-[15rem] min-w-[600px]"
    >
      <InfiniteScroll
        dataLength={postList?.length ?? 0}
        next={loadMoreData}
        hasMore={loadMore}
        loader={
          <Skeleton
            className="w-[30rem]"
            avatar
            paragraph={{ rows: 1 }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollablePost"
      >
        {postList.length > 0 &&
          postList.map((post) => (
            <SNPost
              post={post}
              key={post._id}
              onDelete={handleDeletePost}
              onEdit={showEdit}
              onCommentPost={handleComment}
              onLike={handleLikePost}
            />
          ))}
      </InfiniteScroll>

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
