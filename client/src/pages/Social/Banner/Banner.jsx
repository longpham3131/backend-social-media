import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

const Banner = () => {
  const { pathname } = useLocation();
  const isInvisible = pathname.includes("/profile");
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [img, setImg] = useState("");
  useEffect(() => {
    switch (pathname) {
      case "/members": {
        setTitle("Members");
        setDes("Browse all the members of the community!");
        setImg("images/members-icon.png");
        break;
      }
      case "/groups": {
        setTitle("Groups");
        setDes("Browse all the groups of the community!");
        setImg("images/groups-icon.png");
        break;
      }
      case "/search": {
        setTitle("Search Results:");
        setDes("Browse your search results");
        setImg("images/search-icon.png");
        break;
      }
      default: {
        setTitle("Newsfeed");
        setDes("Check what your friends have been up to!");
        setImg("images/newsfeed-icon.png");
      }
    }
  }, [pathname]);
  return (
    <div
      className={classNames(
        "bg-[url('/images/banner-bg.png')] bg-cover bg-no-repeat w-full h-[160px] relative rounded-xl pl-[200px] pt-[52px] pr-[60px] pb-0 mb-[32px]",
        { hidden: isInvisible }
      )}
    >
      <img src={img} alt="" className=" absolute bottom-0 left-0 " />
      {/* Banner title */}
      <p className=" text-[2.25rem] font-bold leading-[1em] text-white">
        {title}
      </p>
      {/* Banner text */}
      <p className="mt-[10px] text-[1rem] font-medium text-white">{des}</p>
    </div>
  );
};

export default Banner;
