import { Avatar } from "antd";
import React from "react";
import getFirstLetter from "@/util/getFirstLetter";
import { getUrlImage } from "@/util/index";

const SNAvatar = ({ src, fullName, size }) => {
  return (
    <Avatar size={size} src={getUrlImage(src)}>
      {getFirstLetter(fullName)}
    </Avatar>
  );
};

export default SNAvatar;
