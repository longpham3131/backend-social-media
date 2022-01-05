import { Avatar, Badge } from "antd";
import React from "react";
import getFirstLetter from "@/util/getFirstLetter";
import { getUrlImage } from "@/util/index";

const SNAvatar = ({ src, fullName, size,isOnline="undefined" ,className = "" }) => {
  return (
    <Badge status={isOnline === true?"success":"error"} dot={isOnline!="undefined"}>
      <Avatar className={className} size={size} src={getUrlImage(src)}>
        {getFirstLetter(fullName)}
      </Avatar>
    </Badge>
  );
};

export default SNAvatar;
