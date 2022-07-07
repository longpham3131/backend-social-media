import { message } from "antd";
import userAPI from "@/apis/userAPI";
import SNCard from "@/components/SNCard";
import SNNoResult from "@/components/SNNoResult";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

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
          <SNCard
            key={index}
            name={item.fullName}
            coverPicture={item.coverPicture}
            avatar={item.avatar}
            groupCount={item.groups.length}
            postCount={item.postCount}
            friendCount={item.friends.length}
            username={item.username}
            onClick={() => navigate(`/profile/${item._id}`)}
          />
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
