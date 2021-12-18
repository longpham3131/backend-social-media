import { Avatar, Badge, List, message, Popover } from "antd";
import React, { useState } from "react";
import { NotificationOutlined } from "@ant-design/icons";
import notificationAPI from "@/apis/notificationAPI";
import { useEffect } from "react";
import SNAvatar from "@/components/SNAvatar";
const Notification = () => {
  const [notification, setNotification] = useState({});
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
      setNotification(res.data);
      console.log("noti", res.data);
    } catch {
      message.error("Lấy thông báo thất bại");
    }
  };

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
        notification && (
          <List
            itemLayout="horizontal"
            dataSource={notification.data}
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
        <Badge count={notification.countNotification}>
          <NotificationOutlined style={{ fontSize: "20px" }} />
        </Badge>
      </div>
    </Popover>
  );
};

export default Notification;
