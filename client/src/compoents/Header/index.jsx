import "./style.scss";
import { Input } from "antd";
import _defaultAvatar from "assets/images/default-avatar.jpg";
import { useEffect, useRef, useState, useContext } from "react";
import Notifications from "./Notifications";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "store/user/user.action";
import { SocketContext } from "service/socket/SocketContext";
import { getUrlImage } from "util/index";
import { getNotifications } from "store/notifications/notifications.action"
function useOutsideAvatar(ref) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        event.target.className !== "avatar"
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
const { Search } = Input;
const Header = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserProfile(localStorage.getItem("userId")));
  }, []);
  const profileReducer = useSelector((state) => state.userReducer.profile);
  const notifications = useSelector((state) => state.notificationReducer.notifications ?? []);
  const socket = useContext(SocketContext);


  useEffect(() => {
    console.log(notifications)
  }, [notifications])

  useEffect(() => {
    if (profileReducer !== null && profileReducer._id) {
      console.log(profileReducer);
      socket.emit("join-room", "user_" + profileReducer?._id);
      socket.on("notification", (msg) => {
        console.log(msg);
        dispatch(getNotifications())
      });
    }
  }, [profileReducer]);
  const onSearch = (value) => console.log(value);

  let history = useHistory();
  const wrapperRefAva = useRef(null);
  useOutsideAvatar(wrapperRefAva);
  const handleShow = () => {
    let display = wrapperRefAva.current.style.display;

    display === "none"
      ? (wrapperRefAva.current.style.display = "block")
      : (wrapperRefAva.current.style.display = "none");
  };
  return (
    <div className="header">
      <div className="header__content">
        <div
          className="logo"
          onClick={() => {
            history.push("/");
          }}
        >
          Social
        </div>
        <div className="searchInput">
          <Search
            placeholder="Tìm kiếm"
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>
        <div className="listTab">
          <div
            className="listTab__tabHome"
            onClick={() => {
              history.push("/");
            }}
          >
            <i className="fa fa-home"></i>
          </div>
          <div className="listTab__tabMessages">
            <i className="fa fa-comments "></i>
          </div>

          <Notifications />
          <div className="listTab__avatar">
            <img
              src={
                profileReducer?.avatar
                  ? getUrlImage(profileReducer?.avatar)
                  : _defaultAvatar
              }
              alt="avatar"
              className="avatar"
              onClick={handleShow}
            />
            <div className="box" ref={wrapperRefAva}>
              <Link
                to={`/profile/${localStorage.getItem("userId")}`}
                onClick={() => {
                  wrapperRefAva.current.style.display = "none";
                }}
              >
                Trang cá nhân
              </Link>
              <Link to="/login">Đăng xuất</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
