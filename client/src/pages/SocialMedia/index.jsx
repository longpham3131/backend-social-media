import { useEffect } from "react";
import ListPost from "./ListPost";
import RightSideBar from "compoents/RightSideBar";
const SocialMedia = () => {
  return (
    <div className="bodyPage">
      <ListPost />
      <RightSideBar />
    </div>
  );
};
export default SocialMedia;
