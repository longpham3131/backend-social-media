import React, { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SNPost2 from "@/components/SNPost2";
import { useDispatch, useSelector } from "react-redux";
import postAPI from "@/apis/postAPI";
import { Button, Divider, message, Skeleton } from "antd";
import { useParams } from "react-router";
import { useEffect } from "react";
import { setPostList } from "@/store/postSlice";
import SNCreateEditPost from "./SNCreateEditPost";

import { createPost } from "@/store/postSlice";
const SNListPost = ({ showButtonCreatePost = true, isGroupPrivate }) => {
  const postList = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [loadMore, setLoadMore] = useState(true);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { userId, groupId } = useParams();
  const refAddEditPost = useRef(null);
  const fetchPost = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    console.log("fetch post");
    try {
      const res = await postAPI.getPostList({
        limitPost: 10,
        index: 0,
        userId,
        groupId,
      });
      if (res.data === 0) {
        setLoadMore(false);
        return;
      }
      setIndex(index + 1);
      dispatch(setPostList(res.data));
    } catch (error) {
      message.error("Get post list fail");
    } finally {
      setLoading(false);
    }
  };
  const handleCreatePost = async (values) => {
    try {
      const res = await postAPI.createPost({
        ...values,
        groupId,
        audience: groupId
          ? isGroupPrivate
            ? "group private"
            : "group public"
          : values.audience,
        isGroup: groupId ? true : false,
      });
      console.log("success", res.data);
      dispatch(createPost(res.data));
      message.success("Create post success.");
      refAddEditPost.current.resetFields();
      setShowCreatePost(false);
    } catch {
      message.error("Create post fail !");
    }
    console.log("Submit values", values);
  };
  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <div className=" col-span-2">
      {showButtonCreatePost && (
        <>
          <Button
            type="primary"
            size="xl"
            className="w-full mb-[16px]"
            shape="round"
            onClick={() => setShowCreatePost(true)}
          >
            Create Post
          </Button>
          <SNCreateEditPost
            ref={refAddEditPost}
            visible={showCreatePost}
            title="Create Post"
            okText="Create"
            onClose={() => setShowCreatePost(false)}
            onSubmit={handleCreatePost}
          />
        </>
      )}
      <div id="scrollablePost">
        {/* <InfiniteScroll
        dataLength={postList?.length ?? 0}
        next={fetchPost}
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
        <div className="col-span-2">
          {postList.length > 0 &&
            postList.map((post) => <SNPost2 post={post} key={post._id} />)}
        </div>
      </InfiniteScroll> */}
        {loading ? (
          <Skeleton
            className="w-[30rem]"
            avatar
            paragraph={{ rows: 1 }}
            active
          />
        ) : (
          <div className="col-span-2">
            {postList.length > 0 ? (
              postList.map((post) => <SNPost2 post={post} key={post._id} />)
            ) : (
              <Divider plain> NO POST FOUNDED 🤐</Divider>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SNListPost;
