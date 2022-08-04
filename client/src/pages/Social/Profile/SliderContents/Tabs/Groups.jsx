import SNNoResult from "@/components/SNNoResult";
import groupAPI from "@/apis/groupAPI";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { message } from "antd";
import SNCard from "@/components/SNCard";
import { Link } from "react-router-dom";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Groups = ({ user }) => {
  const { userId } = useParams();
  const [groups, setGroups] = useState([]);
  const fetchGroups = async () => {
    try {
      const res = await groupAPI.getGroupJoinedByUserId(userId);
      setGroups(res.data.data);
    } catch (error) {
      message.error("Get group fail!");
    }
  };
  useEffect(() => {
    fetchGroups();
  }, [userId]);
  return (
    <div className="col-span-4">
      <p className="text-color-text-alt text-[0.75rem] font-semibold uppercase">
        Browse {user.fullName}
      </p>
      <p className="mt-[8px] text-color-text text-[1.625rem] font-bold">
        Groups{" "}
        <span className=" text-color-primary-dark text-[1.625rem] font-bold">
          {user.groupCount}
        </span>
      </p>
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
                    quantity: item.membersCount,
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
          <div className="col-span-4 mt-[32px]">
            <SNNoResult />
          </div>
        )}
      </div>
    </div>
  );
};
export default Groups;
