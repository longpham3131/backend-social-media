import RightSideBar from "compoents/RightSideBar";
import DefaultAvatar from "assets/images/default-avatar.jpg";
import DefaultImage from "assets/images/default-image.jpg";
import "./style.scss";
import ListPost from "pages/SocialMedia/ListPost";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { getUserProfile } from "store/actions/user.action";
import { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import { getUrlImage } from "util/index";
import { getPostList } from "store/actions/post.action";
const Profile = () => {
  const quantityImage = [1, 2, 3, 4, 5];
  const dispatch = useDispatch();
  const [limitPost, setLimitPost] = useState(10);
  const { id } = useParams();
  const profileReducer = useSelector((state) => state.userReducer.profile);

  useEffect(() => {
    dispatch(getPostList(limitPost));
    dispatch(getUserProfile(id));
  }, []);

  const postListReducer = useSelector(
    (state) => state.postReducer.postList ?? []
  );

  return (
    <div className="bodyPage" id="Profile">
      {/* Top */}
      <div className="profile">
        <div className="wrapper-content">
          <div
            className="profile__coverBg"
            style={{
              backgroundImage: `url(${
                profileReducer?.coverPicture
                  ? getUrlImage(profileReducer?.coverPicture)
                  : DefaultImage
              })`,
            }}
          >
            <img
              src={
                profileReducer?.avatar
                  ? getUrlImage(profileReducer?.avatar)
                  : DefaultImage
              }
              alt="avatar"
              className="avatar"
            />
          </div>
          <h3 className="text-center py-4">{profileReducer?.fullName}</h3>
        </div>
        {/* Center */}
        <div className="profile__content bodyPage">
          <div className="leftSide">
            <div className="card">
              <p className="card--title-left">Giới thiệu</p>
              <div className="intro pb-2">
                <div className="d-flex justify-content-between">
                  <p>Email liên hệ:</p>
                  <p className="fw-bold">{profileReducer?.email}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Ngày sinh:</p>
                  <p className="fw-bold">{profileReducer?.dateOfBirth}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Số người đang theo dõi:</p>
                  <p className="fw-bold">{profileReducer?.followers?.length}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Số người theo dõi:</p>
                  <p className="fw-bold">
                    {profileReducer?.followings?.length}
                  </p>
                </div>
                <EditProfile />
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
          <ListPost postList={postListReducer} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
