import ListPost from "./ListPost";
import RightSideBar from "./RightSideBar";
import "./style.scss";
const Body = () => {
  return (
    <div className="bodySocial">
      <ListPost />
      <RightSideBar />
    </div>
  );
};
export default Body;
