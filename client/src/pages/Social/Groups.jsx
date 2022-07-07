import { message } from "antd";
import SNCard from "@/components/SNCard";
import SNNoResult from "@/components/SNNoResult";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import groupAPI from "@/apis/groupAPI";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const fetchGroups = async () => {
    try {
      const res = await groupAPI.getAllGroups();
      setGroups(res.data.data);
    } catch (error) {
      message.error("Get group fail!");
    }
  };
  useEffect(() => {
    fetchGroups();
  }, []);
  return (
    <div className="grid grid-cols-4 gap-[16px] mt-[32px]">
      {groups.length > 0 ? (
        groups.map((item, index) => (
          <SNCard
            key={index}
            name={item.groupName}
            coverPicture={item.cover}
            avatar={null}
            groupCount={0}
            postCount={0}
            friendCount={0}
            username={item.groupDescription}
            onClick={() => navigate(`/groups/${item._id}`)}
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

export default Groups;
