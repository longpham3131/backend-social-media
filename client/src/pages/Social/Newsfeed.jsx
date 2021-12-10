import { message } from "antd";
import postAPI from "@/apis/postAPI";
import SNPost from "@/components/SNPost";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPostList } from "@/store/postSlice";
import React from 'react';
const Newsfeed = () => {
  const dispatch = useDispatch();
  const postList = useSelector((state) => state.posts);
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
      console.log("data", postList);
      await dispatch(setPostList(postList.data));
    } catch (error) {
      message.error("Lấy danh sách bài viết thất bại!");
    }
  };
  return (
    <div className="h-full overflow-auto">
      {postList.map((post) => (
        <SNPost post={post} key={post._id} />
      ))}
    </div>
  );
};
export default Newsfeed;
