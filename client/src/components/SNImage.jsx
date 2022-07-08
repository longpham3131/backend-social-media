import React from "react";
import { getUrlImage } from "@/util/index";
import classNames from "classnames";
const SNImage = ({
  urlImage,
  onClick,
  isHiddenOverlay = false,
  hasRounded = true,
}) => {
  return (
    <div
      className={classNames("sn-image", { "rounded-xl": hasRounded })}
      onClick={onClick}
    >
      <div
        className={classNames(" sn-image-background ", {
          "rounded-xl": hasRounded,
        })}
        style={{
          background: `url(${getUrlImage(
            urlImage
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
      </div>
    </div>
  );
};

export default SNImage;
