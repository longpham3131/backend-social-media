import { useEffect, useState } from "react";
import ListPost from "./ListPost";
import RightSideBar from "compoents/RightSideBar";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "store/user/user.action";
import { getPostList } from "store/post/post.action";
const SocialMedia = () => {
  const dispatch = useDispatch();
  const [limitPost, setLimitPost] = useState(10);
  useEffect(() => {
    dispatch(getPostList(limitPost));
  }, []);
  const postListStore = useSelector((state) => state.postReducer.postList??[]);

  // useEffect(() => {
  //   console.log("USERRR", profileStore);
  // }, [profileStore]);

  useEffect(() => {
    console.log(postListStore)
  }, [postListStore])
  return (
    <div className="bodyPage">
      <ListPost postList={postListStore} />
      <RightSideBar />
    </div>
  );
};
export default SocialMedia;
