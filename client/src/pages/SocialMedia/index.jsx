import { useEffect, useState } from "react";
import ListPost from "./ListPost";
import RightSideBar from "compoents/RightSideBar";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "store/actions/user.action";
import { getPostList } from "store/actions/post.action";
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

  return (
    <div className="bodyPage">
      <ListPost postList={postListStore} />
      <RightSideBar />
    </div>
  );
};
export default SocialMedia;
