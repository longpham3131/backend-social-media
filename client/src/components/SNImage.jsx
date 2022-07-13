import React from "react";
import { getUrlImage } from "@/util/index";
import classNames from "classnames";
import postAPI from "@/apis/postAPI";
import { useDispatch } from "react-redux";
import { setModalPost } from "@/store/modalPostSlice";
const SNImage = ({
  isHiddenOverlay = false,
  hasRounded = true,
  quantityImageMore,
  media,
}) => {
  const dispatch = useDispatch();
  const handleClick = async () => {
    const res = await postAPI.getPostByImgId(media._id);
    dispatch(
      setModalPost({
        postId: res.data.data[0]._id,
        show: true,
        mediaSelectedId: media._id,
      })
    );
  };
  return (
    <div
      className={classNames("sn-image", { "rounded-xl": hasRounded })}
      onClick={handleClick}
    >
      <div
        className={classNames(" sn-image-background ", {
          "rounded-xl": hasRounded,
        })}
        style={{
          background: `url(${getUrlImage(
            media.filePath
          )}) center center / cover no-repeat`,
        }}
      >
        <div
          className={classNames("sn-image-overlay", {
            "hidden-overlay": isHiddenOverlay,
            "rounded-xl": hasRounded,
          })}
        >
          <p>See detail</p>
        </div>
        <div
          className={classNames("sn-image-seemore", {
            "hidden-seemore": !quantityImageMore,
          })}
        >
          <p>+{quantityImageMore}</p>
        </div>
      </div>
    </div>
  );
};

export default SNImage;
