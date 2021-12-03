import "./style.scss";
import { Input } from "antd";
import friend from "assets/images/add-friend.svg";
import _defaultAvatar from "assets/images/default-avatar.jpg";
import { useEffect, useRef, useContext, useState } from "react";
import Notifications from "./Notifications";
import Friends from "./Friends";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserCurrentProfile } from "store/user/user.action";
import { getUrlImage } from "util/index";
import { SocketContext } from "service/socket/SocketContext";

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
  const [isHideHeader, setHideHeader] = useState(false);
  const profileReducer = useSelector(
    (state) => state.userReducer.profileCurentUser
  );
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserCurrentProfile());
  }, []);
  useEffect(() => {
    if (profileReducer !== null && profileReducer._id) {
      socket.emit("join-room", "user_" + profileReducer?._id);
    }
  }, [profileReducer]);

  const onSearch = (value) => history.push(`/search/${value}`);

  let history = useHistory();
  const wrapperRefAva = useRef(null);
  useOutsideAvatar(wrapperRefAva);
  const handleShow = () => {
    let display = wrapperRefAva.current.style.display;

    display === "none"
      ? (wrapperRefAva.current.style.display = "block")
      : (wrapperRefAva.current.style.display = "none");
  };
  useEffect(() => {
    setHideHeader(false);
    if (localStorage.getItem("token") == "") setHideHeader(true);
  });
  return (
    <>
      {isHideHeader == false && (
        <div className="header">
          <div
            className="logo"
            onClick={() => {
              history.push("/");
            }}
          >
            Social
          </div>
          <div className="header__searchInput">
            <Search
              placeholder="Tìm kiếm"
              onSearch={onSearch}
              style={{ width: 200 }}
            />
          </div>
          <div className="header__listTab">
            <div
              className="header__tabHome"
              onClick={() => {
                history.push("/");
              }}
            >
              <i className="fa fa-home"></i>
            </div>

            <div className="header__tabMessages">
              <i className="fa fa-comments "></i>
            </div>
            <Friends />
            <Notifications />
            <div className="header__avatar">
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
              <div className="header__box" ref={wrapperRefAva}>
                <Link
                  to={`/profile/${profileReducer._id}`}
                  onClick={() => {
                    wrapperRefAva.current.style.display = "none";
                    // history.push(`/profile/${profileReducer._id}`)
                  }}
                >
                  Trang cá nhân
                </Link>
                <Link
                  onClick={() => {
                    localStorage.setItem("token", "");
                    localStorage.setItem("userId", "");
                    setHideHeader(true)
                  }}
                  to="/login"
                >
                  Đăng xuất
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
