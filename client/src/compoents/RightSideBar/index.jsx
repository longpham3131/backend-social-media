import "./style.scss";
const RightSideBar = ({ user }) => {
  const array = [1, 2, 3, 4, 5];

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
          <p className="rightSidebar__title">Danh sách bạn bè</p>
          <div className="rightSidebar__content">
            {array.map((item, index) => {
              return (
                <div
                  className="d-flex align-items-center pb-3"
                  key={`friend-${index}`}
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
        </div>
      </div>
    </div>
  );
};
export default RightSideBar;
