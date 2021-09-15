import RightSideBar from "compoents/RightSideBar";
import DefaultAvatar from "assets/images/default-avatar.jpg";
import DefaultImage from "assets/images/default-image.jpg";
import "./style.scss";
import ListPost from "pages/SocialMedia/ListPost";
const Profile = () => {
  const quantityImage = [1, 2, 3, 4, 5];
  return (
    <div className="bodyPage" id="Profile">
      {/* Top */}
      <div className="profile">
        <div className="wrapper-content">
          <div
            className="profile__coverBg"
            style={{ backgroundImage: `url(${DefaultImage})` }}
          >
            <img src={DefaultAvatar} alt="avatar" className="avatar" />
          </div>
          <h3 className="text-center py-4">Phạm Hoàng Long</h3>
        </div>
        {/* Center */}
        <div className="profile__content bodyPage">
          <div className="leftSide">
            <div className="card">
              <p className="card--title-left">Giới thiệu</p>
              <div className="intro pb-2">
                <div className="d-flex justify-content-between">
                  <p>Email liên hệ:</p>
                  <p className="fw-bold">long@gmail.com</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Ngày sinh:</p>
                  <p className="fw-bold">07/02/2000</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Số người đang theo dõi:</p>
                  <p className="fw-bold">113 người</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Số người theo dõi:</p>
                  <p className="fw-bold">113 người</p>
                </div>
                <button className="btn btn-secondary w-100 mt-3">
                  Chỉnh sử thông tin
                </button>
              </div>
            </div>

            <div className="card">
              <p className="card--title-left">Ảnh</p>
              <div className="listPicture">
                {quantityImage.map((item, index) => {
                  return <img src={DefaultImage} alt="" className="picture" />;
                })}
              </div>
            </div>
          </div>
          <ListPost />
        </div>
      </div>
    </div>
  );
};

export default Profile;
