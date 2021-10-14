import { useContext, useEffect, useRef, useState } from "react";
import _defaultAvatar from "assets/images/default-avatar.jpg";
import "./style.scss";
import moment from "moment";
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
function useOutsideAlerter(ref) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        event.target.className !== "fa fa-heart"
      ) {
        ref.current.style.display = "none";
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
const Notifications = ({ noti }) => {
  //Init
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);

  useEffect(() => {
    dispatch(getNotifications());
  }, []);
  const profileReducer = useSelector((state) => state.userReducer.profile);
  const notifications = useSelector(
    (state) => state.notificationReducer.notifications ?? []
  );

  const [countNoti, setCountNoti] = useState(0);

  //

  const socket = useContext(SocketContext);

  // Handle count new notifications
  const prevNoti = usePrevious(notifications.total);
  useEffect(() => {
    console.log("pre", prevNoti, "new", notifications.total);
    if (
      prevNoti !== notifications.total &&
      prevNoti &&
      notifications.total !== 0
    ) {
      console.log("preSuc", prevNoti, "new", notifications.total);
      if (notifications.total > prevNoti) {
        setCountNoti(countNoti + 1);
      } else {
        if (countNoti !== 0) {
          setCountNoti(countNoti - 1);
        }
      }
    }
  }, [notifications]);
  //

  useEffect(() => {
    if (profileReducer !== null && profileReducer._id) {
      socket.emit("join-room", "user_" + profileReducer?._id);
      socket.on("notification", (msg) => {
        console.log("messs-notify", msg);
        dispatch(getNotifications());
      });
    }
  }, [profileReducer]);
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

  return (
    <div className="tabNotify" onClick={handleShowNotify}>
      <div className="position-relative">
        <i className="fa fa-heart"></i>
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
        {notifications.data &&
          notifications.data.map((item, index) => {
            return (
              <div className="tabNotify__item" key={index}>
                <div className="position-relative">
                  <img
                    src={
                      item.fromUser.avatar
                        ? getUrlImage(item?.fromUser?.avatar)
                        : _defaultAvatar
                    }
                    alt="avatar"
                    className="avatar"
                  />
                  <div className="tabNotify__iconReact">
                    {item.type === 1 ? (
                      <LikeFilled style={{ color: "#2078f4" }} />
                    ) : item.type === 2 ? (
                      <CommentOutlined />
                    ) : (
                      <ShareAltOutlined />
                    )}
                  </div>
                </div>

                <div className="w-100 px-2">
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      {item.fromUser.fullName}
                    </span>{" "}
                    đã{" "}
                    {item.type === 1
                      ? "thích"
                      : item.type === 2
                      ? "bình luận"
                      : "chia sẻ"}{" "}
                    bài viết của bạn
                  </p>
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

export default Notifications;
