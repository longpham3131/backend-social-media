import { Avatar, Badge, List, message, notification, Popover } from "antd";
import React, { useState } from "react";
import { NotificationOutlined } from "@ant-design/icons";
import notificationAPI from "@/apis/notificationAPI";
import { useEffect } from "react";
import SNAvatar from "@/components/SNAvatar";
import { useContext } from "react";
import { SocketContext } from "@/service/socket/SocketContext";
const Notification = () => {
  const [notificationState, setNotificationState] = useState({});
  const socket = useContext(SocketContext);
  const data = [
    {
      title: "Ant Design Title 1",
    },
    {
      title: "Ant Design Title 2",
    },
    {
      title: "Ant Design Title 3",
    },
    {
      title: "Ant Design Title 4",
    },
  ];

  useEffect(() => {
    fetchNoti();
  }, []);

  const fetchNoti = async () => {
    try {
      const res = await notificationAPI.getNotify();
      setNotificationState(res.data);
      console.log("noti", res.data);
    } catch {
      message.error("Lấy thông báo thất bại");
    }
  };
  useEffect(() => {
    socket.on("notification", (msg) => {
      console.log("messs-notify", msg);
      fetchNoti();
      // Không hiện thông báo khi dislike (-2)
      if (msg.type !== -2) {
        notification.info({
          message: `Thông báo`,
          description:
            "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
          placement: "bottomLeft",
        });
      }
    });
  }, []);

  const descriptionNoti = (type) => {
    switch (type) {
      case 1:
        return "Đã thích bài viết của bạn.";
      case 2:
        return "Đã bình luận bài viết của bạn.";
      case 3:
        return "Đã chia sẽ bài viết của bạn.";
      case 4:
        return "Đã thích bình luận của bạn.";
      case 5:
        return "Đã trả lời bình luận của bạn";
      default:
        return "Đã chấp nhận lời mời kết bạn";
    }
  };
  return (
    <Popover
      placement="bottom"
      title={"Thông báo"}
      overlayInnerStyle={{
        minWidth: "30rem",
        maxHeight: "50rem",
        overflow: "auto",
      }}
      content={
        notificationState && (
          <List
            itemLayout="horizontal"
            dataSource={notificationState.data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <SNAvatar
                      src={item.fromUser.avatar}
                      fullName={item.fromUser.fullName}
                    />
                  }
                  title={<span>{item.fromUser.fullName}</span>}
                  description={descriptionNoti(item.type)}
                />
              </List.Item>
            )}
          />
        )
      }
      trigger="click"
    >
      <div>
        <Badge count={notificationState.countNotification}>
          <NotificationOutlined style={{ fontSize: "20px" }} />
        </Badge>
      </div>
    </Popover>
  );
};

export default Notification;
