import { Badge, List, Popover } from "antd";
import userAPI from "@/apis/userAPI";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "@/service/socket/SocketContext";
import { setProfile } from "@/store/profileSlice";
import { Link } from "react-router-dom";
import { UsergroupAddOutlined } from "@ant-design/icons";
import SNAvatar from "@/components/SNAvatar";
import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import { formatMinutes } from "@/util/index";
const FriendRequest = () => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state?.profile);
  const handleFriendRequestRespone = async ({ userId, type }) => {
    await userAPI.friendRespone({
      userId,
      type,
    });
    const myProfile = await userAPI.getMyProfile();
    dispatch(setProfile(myProfile.data.data));
  };

  useEffect(() => {
    if (myProfile == null && !myProfile._id) return;
    socket.emit("leave-all-and-join-room", "user_" + myProfile?._id);
  }, [myProfile]);

  useEffect(() => {
    socket.on("friendRequest", (msg) => {
      dispatch(setProfile(msg.userRequest));
    });
  }, []);

  return (
    <Popover
      placement="bottom"
      title={"Friend request"}
      overlayInnerStyle={{
        minWidth: "30rem",
        maxHeight: "50rem",
        overflow: "auto",
      }}
      content={
        <List
          itemLayout="horizontal"
          dataSource={myProfile?.friendsRequest ?? []}
          renderItem={(item) => (
            <List.Item
              actions={[
                <span
                  key="list-loadmore-edit"
                  className=" cursor-pointer"
                  onClick={() =>
                    handleFriendRequestRespone({
                      userId: item.user._id,
                      type: 1,
                    })
                  }
                >
                  Accept
                </span>,
                <span
                  key="list-loadmore-more"
                  className=" cursor-pointer"
                  onClick={() =>
                    handleFriendRequestRespone({
                      userId: item.user._id,
                      type: 0,
                    })
                  }
                >
                  Delete
                </span>,
              ]}
            >
              <Link to={`/profile/${item.user._id}`}>
                <SNWidgetBoxItem
                  srcAvatar={item.user.avatar}
                  name={item.user.fullName}
                  description={formatMinutes(item.createAt)}
                />
              </Link>
            </List.Item>
          )}
        />
      }
      trigger="click"
    >
      <div>
        <Badge count={myProfile?.friendsRequest?.length ?? 0}>
          <UsergroupAddOutlined style={{ fontSize: "20px", color: "#fff" }} />
        </Badge>
      </div>
    </Popover>
  );
};

export default FriendRequest;
