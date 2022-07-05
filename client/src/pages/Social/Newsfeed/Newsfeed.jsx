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
  deletePostComment,
} from "@/store/postSlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CreateEditPost from "@/components/SNCreateEditPost";
import InfiniteScroll from "react-infinite-scroll-component";
import SNWidgetBox from "@/components/SNWidgetBox";
import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
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

  const fetchPostList = async () => {
    try {
      const postList = await postAPI.getPostList({
        limitPost: 6,
        index: 0,
      });
      await dispatch(setPostList(postList.data));
    } catch (error) {
      console.log(error);
      message.error("get post failed!");
    }
  };
  const handleEditPost = async (values) => {
    values.postId = selectedPostId;
    console.log("success", values);
    try {
      const res = await postAPI.editPost(values);
      console.log("success", res.data);
      dispatch(editPost(res.data));
      message.success("Edit post success.");
      refAddEditPost.current.resetFields();
      setShowEditPost(false);
    } catch {
      message.error("Edit post failed!");
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
          message.success("Delete post success!");
        } catch {
          message.error("Delete post failed!");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleDeletePostComment = async (data) => {
    confirm({
      title: "Do you want to delete this post?",
      icon: <ExclamationCircleOutlined />,
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        try {
          await postAPI.deleteComment(data);
          await dispatch(deletePostComment(data));
          message.success("Delete post success!");
        } catch (err) {
          console.log(err);
          message.error("Delete post failed!");
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
      message.error("Post comment failed!");
    }
  };
  const handleLikePost = async (postId) => {
    try {
      const res = await postAPI.likePost(postId);
      dispatch(likePost(res.data));
    } catch {
      message.error("Liked the failed post!");
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
  // Data member
  const members = [
    {
      name: "Sandra Amuda",
      avatar: profile?.avatar,
      description: "@Sandra",
    },
    {
      name: "Alex Kilo",
      avatar: profile?.avatar,
      description: "@Alex",
    },
    {
      name: "Smith Halo",
      avatar: profile?.avatar,
      description: "@Smith",
    },
    {
      name: "Johnny Deep",
      avatar: profile?.avatar,
      description: "@Johnny",
    },
    {
      name: "Mohamed Sela",
      avatar: profile?.avatar,
      description: "@Mohamed",
    },
  ];
  const groups = [
    {
      name: "Street Artists",
      avatar: profile?.avatar,
      member: "3 members",
      leftIcon: (
        <FontAwesomeIcon
          icon={faEarthAmericas}
          className=" text-lg text-color-icon"
        />
      ),
    },
    {
      name: "Cosplayers of the World",
      avatar: profile?.avatar,
      member: "5 members",
      leftIcon: (
        <FontAwesomeIcon
          icon={faEarthAmericas}
          className=" text-lg text-color-icon"
        />
      ),
    },
    {
      name: "Stream Designers",
      avatar: profile?.avatar,
      member: "3 members",
      leftIcon: (
        <FontAwesomeIcon
          icon={faEarthAmericas}
          className=" text-lg text-color-icon"
        />
      ),
    },
    {
      name: "Gaming Watchtower",
      avatar: profile?.avatar,
      member: "6 members",
      leftIcon: (
        <FontAwesomeIcon icon={faLock} className=" text-lg text-color-icon" />
      ),
    },
    {
      name: "Living in Japan",
      avatar: profile?.avatar,
      member: "1 members",
      leftIcon: (
        <FontAwesomeIcon
          icon={faEarthAmericas}
          className=" text-lg text-color-icon"
        />
      ),
    },
  ];
  // End data member
  return (
    <div className="grid grid-cols-4 gap-4 mt-[32px]">
      <SNWidgetBox
        title={"Newest Members"}
        content={members.map((item, index) => (
          <SNWidgetBoxItem
            key={index}
            srcAvatar={item.avatar}
            name={item.name}
            description={item.description}
          />
        ))}
      />

      <div id="scrollablePost" className=" col-span-2">
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
                onDeleteComment={handleDeletePostComment}
                onEdit={showEdit}
                onCommentPost={handleComment}
                onLike={handleLikePost}
              />
            ))}
        </InfiniteScroll>

        <CreateEditPost
          ref={refAddEditPost}
          visible={showEditPost}
          title="Edit post"
          okText="Update"
          onClose={() => setShowEditPost(false)}
          onSubmit={handleEditPost}
        />
      </div>
      <SNWidgetBox
        title={"Groups"}
        content={groups.map((item, index) => (
          <SNWidgetBoxItem
            key={index}
            srcAvatar={item.avatar}
            name={item.name}
            description={item.member}
            leftIcon={item.leftIcon}
          />
        ))}
      />
    </div>
  );
};
export default Newsfeed;
