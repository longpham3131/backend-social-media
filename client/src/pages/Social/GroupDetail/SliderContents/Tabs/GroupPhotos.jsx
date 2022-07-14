import SNImage from "@/components/SNImage";
import userAPI from "@/apis/userAPI";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import SNNoResult from "@/components/SNNoResult";
import groupAPI from "@/apis/groupAPI";
import { useSelector } from "react-redux";

const GroupPhotos = ({ user }) => {
  const group = useSelector((state) => state.group);
  const [images, setImages] = useState([]);
  const fetchAllImage = async () => {
    try {
      const res = await groupAPI.getImagesGroup(group._id);
      console.log(res.data.data);
      setImages(res.data.data);
    } catch (erorr) {
      console.log("error get image");
    }
  };
  useEffect(() => {
    fetchAllImage();
  }, []);
  return (
    <div className=" col-span-4 ">
      <p className="text-color-text-alt text-[0.75rem] font-semibold uppercase">
        Browse {group.groupName}
      </p>
      <p className="mt-[8px] text-color-text text-[1.625rem] font-bold">
        Media{" "}
        <span className=" text-color-primary-dark text-[1.625rem] font-bold">
          {images.length}
        </span>
      </p>
      <div className="grid grid-cols-6 gap-[16px] mt-[32px]">
        {images.length ? (
          images.map((item, index) => <SNImage media={item} key={index} />)
        ) : (
          <div className=" col-span-6 text-center">
            <SNNoResult />
          </div>
        )}
      </div>
    </div>
  );
};
export default GroupPhotos;
