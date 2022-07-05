import classNames from "classnames";
import React from "react";
import { useLocation } from "react-router";

const Banner = () => {
  const location = useLocation();
  const isInvisible = location.pathname.includes("/profile");
  return (
    <div
      className={classNames(
        "bg-[url('/images/banner-bg.png')] bg-cover bg-no-repeat w-full h-[160px] relative rounded-xl pl-[200px] pt-[52px] pr-[60px] pb-0",
        { hidden: isInvisible }
      )}
    >
      <img
        src="images/newsfeed-icon.png"
        alt=""
        className=" absolute bottom-0 left-0 "
      />
      {/* Banner title */}
      <p className=" text-[2.25rem] font-bold leading-[1em] text-white">
        Newsfeed
      </p>
      {/* Banner text */}
      <p className="mt-[10px] text-[1rem] font-medium text-white">
        Check what your friends have been up to!
      </p>
    </div>
  );
};

export default Banner;
