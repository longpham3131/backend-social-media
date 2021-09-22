import { useEffect, useRef, useState } from "react";
import _defaultAvatar from "assets/images/default-avatar.jpg";
import "./style.scss";

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
const Notifications = () => {
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
        <div className="noti">
          <img src={_defaultAvatar} alt="avatar" />
          <div className="w-100 px-2">
            <p>
              <span style={{ fontWeight: "bold" }}>Thanh hải</span> đã thích bài
              viết của bạn
            </p>
            <p style={{ textAlign: "right", fontSize: "12px" }}>
              28 phút trước
            </p>
          </div>
        </div>
        <div className="noti">
          <img src={_defaultAvatar} alt="avatar" />
          <div className="w-100 px-2">
            <p>
              <span style={{ fontWeight: "bold" }}>Thanh hải</span> đã thích bài
              viết của bạn
            </p>
            <p style={{ textAlign: "right", fontSize: "12px" }}>
              28 phút trước
            </p>
          </div>
        </div>
        <div className="noti">
          <img src={_defaultAvatar} alt="avatar" />
          <div className="w-100 px-2">
            <p>
              <span style={{ fontWeight: "bold" }}>Thanh hải</span> đã thích bài
              viết của bạn
            </p>
            <p style={{ textAlign: "right", fontSize: "12px" }}>
              28 phút trước
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
