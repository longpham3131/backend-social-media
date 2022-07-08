import { message } from "antd";
import SNCard from "@/components/SNCard";
import SNNoResult from "@/components/SNNoResult";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import groupAPI from "@/apis/groupAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
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
          <Link key={index} to={`/groups/${item._id}`}>
            <SNCard
              name={item.groupName}
              coverPicture={item.cover}
              avatar={item.avatar}
              isGroup={true}
              description={item.groupDescription}
              quantityCount={[
                {
                  quantity: item.isPrivate ? (
                    <FontAwesomeIcon
                      icon={faLock}
                      className=" text-lg text-color-text"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faEarthAmericas}
                      className=" text-lg text-color-text"
                    />
                  ),
                  name: item.isPrivate ? "Private" : "Public",
                },
                {
                  quantity: item.members.length,
                  name: "members",
                },
                {
                  quantity: item.postCount,
                  name: "post",
                },
              ]}
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

export default Groups;
