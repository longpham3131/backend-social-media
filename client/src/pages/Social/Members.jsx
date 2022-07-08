import { message } from "antd";
import userAPI from "@/apis/userAPI";
import SNCard from "@/components/SNCard";
import SNNoResult from "@/components/SNNoResult";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const Members = () => {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const fetchMembers = async () => {
    try {
      const res = await userAPI.getMembers();
      setMembers(res.data.data.items);
    } catch (error) {
      message.error("Get members fail!");
    }
  };
  useEffect(() => {
    fetchMembers();
  }, []);
  return (
    <div className="grid grid-cols-4 gap-[16px] mt-[32px]">
      {members.length > 0 ? (
        members.map((item, index) => (
          <Link key={index} to={`/profile/${item._id}`}>
            <SNCard
              name={item.fullName}
              coverPicture={item.coverPicture}
              avatar={item.avatar}
              quantityCount={[
                {
                  name: "posts",
                  quantity: item.postCount,
                },
                {
                  name: "friends",
                  quantity: item.friends.length,
                },
                {
                  name: "groups",
                  quantity: item.groups.length,
                },
              ]}
              username={item.username}
            />
          </Link>
        ))
      ) : (
        <div className="mt-[32px]">
          <SNNoResult />
        </div>
      )}
    </div>
  );
};

export default Members;
