import "./style.scss";
import { useSelector } from "react-redux";
import { getUrlImage } from "util/index";
import { Link, useHistory } from "react-router-dom";
const RightSideBar = ({ user }) => {
  const array = [1, 2, 3, 4, 5];
  const profileReducer = useSelector(
   
    (state) => state.userReducer.profileCurentUser
  );
  return (
    <div className="rightSidebar">
      <div className="rightSidebar__position">
        {/* Gợi ý kết bạn  */}
        {/* <div className="card">
          <p className="rightSidebar__title">Gợi ý bạn bè</p>
          <div className="rightSidebar__content">
            {array.map((item, index) => {
              return (
                <div
                  className="d-flex align-items-center pb-3"
                  key={`suggetion--${index}`}
                >
                  <img
                    src={user?.avatar}
                    alt=""
                    className={user?.avatar ? "avatar" : "avatar skeleton"}
                  />
                  <p className={user?.name ? "" : "skeleton skeleton-username"}>
                    {user?.username}
                  </p>
                </div>
              );
            })}
          </div>
        </div> */}
        {/* Danh sách bạn bè */}
        <div className="card">
          <p className="rightSidebar__cardTitle">Danh sách bạn bè</p>
          <div className="rightSidebar__cardContent">
            {profileReducer.friends?.map((friend, index) => {
              return (
                <Link
                to={`/profile/${friend.user._id}`}
               
              >
                <div
                  className="d-flex align-items-center pb-3"
                  key={`friend-${friend.user._id}`}
                >
                  <img
                    src={getUrlImage(friend?.user.avatar)}
                    alt=""
                    className={friend?.user.avatar ? "avatar" : "avatar skeleton"}
                  />
                  <p className={friend.user?.fullName ? "" : "skeleton skeleton-username"}>
                    {friend.user?.fullName}
                  </p>
                </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RightSideBar;
