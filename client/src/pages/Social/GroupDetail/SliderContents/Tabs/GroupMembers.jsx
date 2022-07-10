import SNNoResult from "@/components/SNNoResult";
import userAPI from "@/apis/userAPI";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import SNCard from "@/components/SNCard";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const GroupMembers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const group = useSelector((state) => state.group);

  return (
    <div className="col-span-4">
      <p className="text-color-text-alt text-[0.75rem] font-semibold uppercase">
        Browse {group.groupName}
      </p>
      <p className="mt-[8px] text-color-text text-[1.625rem] font-bold">
        Members{" "}
        <span className=" text-color-primary-dark text-[1.625rem] font-bold">
          {group.members.length}
        </span>
      </p>
      <div className="grid grid-cols-4 gap-[16px] mt-[32px]">
        {group.members.length > 0 ? (
          group.members.map((item, index) => (
            <Link key={index} to={`/profile/${item.user._id}`}>
              <SNCard
                name={item.user.fullName}
                coverPicture={item.user.coverPicture}
                avatar={item.user.avatar}
                username={item.user.username}
                quantityCount={[
                  {
                    name: "posts",
                    quantity: item.postCount,
                  },
                  {
                    name: "friends",
                    quantity: item.friendCount,
                  },
                  {
                    name: "groups",
                    quantity: item.groupCount,
                  },
                ]}
              />
            </Link>
          ))
        ) : (
          <div className="col-span-4 mt-[32px]">
            <SNNoResult />
          </div>
        )}
      </div>
    </div>
  );
};
export default GroupMembers;
