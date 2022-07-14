import React from "react";
import { getUrlImage } from "@/util/index";
import classNames from "classnames";
import postAPI from "@/apis/postAPI";
import { useDispatch } from "react-redux";
import { setModalPost } from "@/store/modalPostSlice";
import { getUrlVideo } from "@/util/index";
import { PlayCircleOutlined } from "@ant-design/icons";
const SNImage = ({
  isHiddenOverlay = false,
  hasRounded = true,
  quantityImageMore,
  media,
  isControlsVideo = false,
  iconPlaySize = 32,
}) => {
  const dispatch = useDispatch();
  const isVideo = media.fileType === "video/mp4";
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
      className={classNames("sn-image", {
        "rounded-xl": hasRounded,
        "aspect-square": !isVideo,
      })}
      onClick={handleClick}
    >
      <div
        className={classNames(" sn-image-background ", {
          "rounded-xl": hasRounded,
          "flex justify-center items-center relative": isVideo,
        })}
        style={{
          background: isVideo
            ? "black"
            : `url(${getUrlImage(
                media.filePath
              )}) center center / cover no-repeat`,
        }}
      >
        {isVideo && (
          <>
            <video controls={isControlsVideo}>
              <source src={getUrlVideo(media.filePath)} />
            </video>
            {!isControlsVideo && (
              <PlayCircleOutlined
                className=" absolute text-white text-[2rem] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                style={{ fontSize: iconPlaySize + "px" }}
              />
            )}
          </>
        )}
        {!isVideo && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default SNImage;
