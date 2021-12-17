import RightSideBar from "compoents/RightSideBar";
import DefaultAvatar from "assets/images/default-avatar.jpg";
import DefaultImage from "assets/images/default-image.jpg";
import { Button } from "antd";
import "./style.scss";
import ListPost from "pages/SocialMedia/ListPost";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { friendRelate } from "util/index";
import Dialog from "compoents/Dialog/index";
import {
  friendRequest,
  getUserProfile,
  unfriend,
} from "store/user/user.action";
import { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import { getUrlImage } from "util/index";
import { getPostList } from "store/post/post.action";
import { getImageUser } from "store/user/user.action";
import PostDialog from "pages/SocialMedia/ListPost/Post/PostDialog";
const Profile = (props) => {
  const quantityImage = [1, 2, 3, 4, 5];
  const dispatch = useDispatch();
  const [limitPost, setLimitPost] = useState(10);
  const { id } = useParams();
  const [isFriendRequest, setFriendRequest] = useState(false);
  const [isFriend, setFriend] = useState(false);
  const [friendRelate, setFriendRelate] = useState(0);
  const [isShowPost, setShowPost] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  useEffect(() => {
    dispatch(getPostList({ limitPost: 10, index: 0, profile: 1, userId: id }));
    dispatch(getUserProfile(id));
    dispatch(getImageUser(id));
  }, [props.match.params]);

  const profileUserReducer = useSelector(
    (state) => state.userReducer.profileCurentUser
  );
  const profileReducer = useSelector((state) => state.userReducer.profile);
  const imagesUser = useSelector((state) => state.userReducer.imagesUser);
  useEffect(() => {
    console.log("listimg", imagesUser);
  }, [imagesUser]);
  useEffect(() => {
    if (!profileReducer.friendsRequest) return;
    const isAFriend =
      !!profileReducer.friends?.find(
        (e) => e.user._id == profileUserReducer._id
      ) ?? false;
    setFriend(isAFriend);
    if (!isAFriend) {
      if (profileReducer?.friendsRequest?.length <= 0) setFriendRequest(false);
      else {
        const find = profileReducer.friendsRequest.find(
          (e) => e.user._id == profileUserReducer._id
        );
        find ? setFriendRequest(true) : setFriendRequest(false);
      }
    }
  }, [profileReducer]);

  const postListReducer = useSelector(
    (state) => state.postReducer.postList ?? []
  );
  const handleFriendRequest = (type) => {
    dispatch(
      friendRequest({
        userId: profileReducer._id,
        type,
      })
    );
  };
  const Unfriend = () => {
    dispatch(
      unfriend({
        userId: profileReducer._id,
      })
    );
  };
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
          <div className="actions-wrapper d-flex justify-content-end pe-1 pb-1 ">
            {profileReducer._id !== profileUserReducer._id && (
              <>
                {isFriend ? (
                  <div>
                    <Button onClick={() => Unfriend()}>Huỷ kết bạn</Button>
                  </div>
                ) : (
                  <>
                    {!isFriendRequest && (
                      <div>
                        <Button onClick={() => handleFriendRequest(1)}>
                          Kết bạn
                        </Button>
                      </div>
                    )}
                    {!!isFriendRequest && (
                      <div>
                        <Button onClick={() => handleFriendRequest(0)}>
                          Huỷ yêu cầu kết bạn
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
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
                {imagesUser.reverse().map((item, index) => {
                  return (
                    <img
                      key={index}
                      width={100}
                      style={{ objectFit: "cover" }}
                      height={100}
                      src={getUrlImage(item.filePath)}
                      alt=""
                      className="picture"
                      onClick={() => {
                        setCurrentImage(item);
                        setShowPost(true);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <ListPost postList={postListReducer} />
        </div>
      </div>
      <Dialog
        isShow={isShowPost}
        handleHideDialog={() => {
          setShowPost(false);
        }}
        width={1100}
        title={null}
        useFooter={false}
        content={<PostDialog image={currentImage} />}
      />
    </div>
  );
};

export default Profile;
