import SNNoResult from "@/components/SNNoResult";
import React from "react";

const Friends = ({ user }) => {
  return (
    <div className="col-span-4">
      <p className="text-color-text-alt text-[0.75rem] font-semibold uppercase">
        Browse {user.fullName}
      </p>
      <p className="mt-[8px] text-color-text text-[1.625rem] font-bold">
        FRIENDS{" "}
        <span className=" text-color-primary-dark text-[1.625rem] font-bold">
          {user.friends.length}
        </span>
      </p>
      <div className="mt-[100px]">
        <SNNoResult />
      </div>
    </div>
  );
};
export default Friends;
