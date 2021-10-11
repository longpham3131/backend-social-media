import { useEffect, useRef, useState } from "react";
import _defaultAvatar from "assets/images/default-avatar.jpg";
import "./style.scss";
import moment from "moment";
import "moment/locale/vi"; // without this line it didn't work
import { getUrlImage } from "util/index";
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  LikeFilled,
} from "@ant-design/icons";
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
const Notifications = ({ noti }) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  const handleShowNotify = () => {
    let display = wrapperRef.current.style.display;

    display === "none"
      ? (wrapperRef.current.style.display = "block")
      : (wrapperRef.current.style.display = "none");
  };

  return (
    <div className="tabNotify" onClick={handleShowNotify}>
      <i className="fa fa-heart"></i>
      <div ref={wrapperRef} className="tabNotify__boxTab">
        <p className="boxTab__header">Thông báo</p>

        {/* Notify */}
        {noti?.map((item, index) => {
          return (
            <div className="noti" key={index}>
              <div class="position-relative">
                <img
                  src={
                    item?.fromUser?.avatar
                      ? getUrlImage(item?.fromUser?.avatar)
                      : _defaultAvatar
                  }
                  alt="avatar"
                  className="avatar"
                />
                <div className="noti--iconReact">
                  {item?.type === 1 ? (
                    <LikeFilled style={{ color: "#2078f4" }} />
                  ) : item?.type === 2 ? (
                    <CommentOutlined />
                  ) : (
                    <ShareAltOutlined />
                  )}
                </div>
              </div>

              <div className="w-100 px-2">
                <p>
                  <span style={{ fontWeight: "bold" }}>
                    {item?.fromUser?.fullName}
                  </span>{" "}
                  đã{" "}
                  {item?.type === 1
                    ? "thích"
                    : item?.type === 2
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
