import { useContext, useEffect, useRef, useState } from "react";
import _defaultAvatar from "assets/images/default-avatar.jpg";
import "./style.scss";
import moment from "moment";
import friend from "assets/images/add-friend.svg";
import "moment/locale/vi"; // without this line it didn't work
import { getUrlImage } from "util/index";
import {
  CommentOutlined,
  ShareAltOutlined,
  LikeFilled,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { SocketContext } from "service/socket/SocketContext";
import { useDispatch } from "react-redux";
import { getNotifications } from "store/notifications/notifications.action";
import { useOutsideAlerter } from "util/index";
import {
  getUserCurrentProfile,
  getFriendsRequest,
  friendRequestRespone,
} from "store/user/user.action";
const Friends = ({ noti }) => {
  //Init
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);

  useEffect(() => {
    dispatch(getNotifications());
  }, []);
  const profileReducer = useSelector(
    (state) => state.userReducer.profileCurentUser
  );
  const friendsRequest = useSelector(
    (state) => state.userReducer.friendsRequest
  );
  const notifications = useSelector(
    (state) => state.notificationReducer.notifications ?? []
  );

  const [countNoti, setCountNoti] = useState(0);

  //

  const socket = useContext(SocketContext);
  useEffect(() => {
  }, [friendsRequest]);

  useEffect(() => {
    dispatch(getFriendsRequest());
  }, [profileReducer]);
  //
  useEffect(() => {
    socket.on("friendRequest", (msg) => {
      console.log("messs-notify", msg);
      dispatch(getUserCurrentProfile());
    });
  }, []);

  //Handle
  useOutsideAlerter(wrapperRef);
  const handleShowNotify = () => {
    let display = wrapperRef.current.style.display;

    if (display === "none") {
      wrapperRef.current.style.display = "block";
      setCountNoti(0);
    } else {
      wrapperRef.current.style.display = "none";
    }
    // display === "none"
    //   ? (wrapperRef.current.style.display = "block")
    //   : (wrapperRef.current.style.display = "none");
  };
  //
  const handleFriendRequestRespone = ({userId,type}) => {
    dispatch(
      friendRequestRespone({
        userId,
        type
      })
    );
  };
  return (
    <div className="tabNotify" onClick={handleShowNotify}>
      <div className="position-relative">
        <img width={30} src={friend} />
        <span
          className="tabNotify__countNoti"
          style={{ display: countNoti > 0 ? "block" : "none" }}
        >
          {countNoti}
        </span>
      </div>

      <div ref={wrapperRef} className="tabNotify__boxItems">
        <p className="tabNotify__headerBox">Thông báo</p>

        {/* Notify */}
        {friendsRequest?.length > 0 &&
          friendsRequest.map((item, index) => {
            return (
              <div className="tabNotify__item" key={index}>
                <div className="position-relative">
                  <img
                    src={
                      item.user?.avatar
                        ? getUrlImage(item.user?.avatar)
                        : _defaultAvatar
                    }
                    alt="avatar"
                    className="avatar"
                  />
                </div>

                <div className="w-100 px-2">
                  <p >
                    <span style={{ fontWeight: "bold" }}>
                      {item.user?.fullName}
                    </span>{" "}
                  </p>
                  <div className="friend-respone">
                    <button onClick={()=>handleFriendRequestRespone({userId:item.user._id,type:1})} className="btn  acc friend-respone__accept">Chấp nhận</button>
                    <button onClick={()=>handleFriendRequestRespone({userId:item.user._id,type:0})} className="btn friend-respone__deny">Từ chối</button>
                  </div>
                  <p style={{ textAlign: "right", fontSize: "12px" }}>
                    {moment(item?.createAt).startOf("hour").fromNow()}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Friends;
