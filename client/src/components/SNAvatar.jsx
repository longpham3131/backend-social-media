import { Avatar, Badge } from "antd";
import React from "react";
import getFirstLetter from "@/util/getFirstLetter";
import { getUrlImage } from "@/util/index";
import styled from "styled-components";

const StyledAvatar = styled.div`
  &:before {
    background: url(${(props) => getUrlImage(props.src)}) center/cover;
  }
`;

const SNAvatar = ({
  src,
  fullName,
  size,
  isOnline = "undefined",
  className = "",
}) => {
  return (
    <Badge
      status={isOnline === true ? "success" : "error"}
      color={isOnline ? "#87d068" : "#bfbdbd"}
      className="sn-avatar"
    >
      {/* <Avatar
        className={{ "octagon-avatar": true, className }}
        size={size}
        src={getUrlImage(src)}
        shape={"square"}
      >
        {getFirstLetter(fullName)}
      </Avatar> */}
      <div
        className="sn-avatar-outside"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <StyledAvatar src={src} className="sn-avatar-inner" />
        {/* <div className="sn-avatar-inner"></div> */}
      </div>
      <svg
        style={{ visibility: "hidden", position: "absolute" }}
        width={0}
        height={0}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <filter id="round">
            <feGaussianBlur in="SourceGraphic" stdDeviation={5} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </Badge>
  );
};

export default SNAvatar;
