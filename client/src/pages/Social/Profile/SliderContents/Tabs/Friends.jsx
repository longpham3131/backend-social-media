import SNNoResult from "@/components/SNNoResult";
import userAPI from "@/apis/userAPI";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import SNCard from "@/components/SNCard";
import { Link } from "react-router-dom";

const Friends = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const { userId } = useParams();

  const fetchFriends = async () => {
    const res = await userAPI.getFriends(userId);
    setFriends(res.data.data);
    console.log("res get friends", res.data.data);
  };
  const handleClickCard = (userId) => {
    navigate(`/profile/${userId}`);
    // fetchFriends();
  };

  useEffect(() => {
    fetchFriends();
  }, [userId]);

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
      <div className="grid grid-cols-4 gap-[16px] mt-[32px]">
        {friends.length > 0 ? (
          friends.map((item, index) => (
            <Link key={index} to={`/profile/${item.user._id}`}>
              <SNCard
                name={item.user.fullName}
                coverPicture={item.user.coverPicture}
                avatar={item.user.avatar}
                quantityCount={[
                  {
                    name: "posts",
                    quantity: item.user.postCount,
                  },
                  {
                    name: "friends",
                    quantity: item.user.friends.length,
                  },
                  {
                    name: "groups",
                    quantity: item.user.groups.length,
                  },
                ]}
                username={item.user.username}
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
export default Friends;
