import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";

const Banner = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");

  const [des, setDes] = useState("");
  const [img, setImg] = useState("");

  useEffect(() => {
    setIsVisible(true);
    if (pathname === "/members") {
      setTitle("Members");
      setDes("Browse all the members of the community!");
      setImg("images/members-icon.png");
    } else if (pathname === "/groups") {
      setTitle("Groups");
      setDes("Browse all the groups of the community!");
      setImg("images/groups-icon.png");
    } else if (pathname.includes("search")) {
      setTitle(`Search Results:"${searchParams.get("q")}"`);
      setDes("Browse your search results");
      setImg("images/search-icon.png");
    } else if (pathname === "/") {
      setTitle("Newsfeed");
      setDes("Check what your friends have been up to!");
      setImg("images/newsfeed-icon.png");
    } else {
      setIsVisible(false);
    }
  }, [pathname, searchParams.get("q")]);
  return (
    <div
      className={classNames(
        "bg-[url('/images/banner-bg.png')] bg-cover bg-no-repeat w-full h-[160px] relative rounded-xl pl-[200px] pt-[52px] pr-[60px] pb-0 mb-[32px]",
        { hidden: !isVisible }
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
