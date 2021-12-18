import {
  Divider,
  Badge,
  List,
  message,
  notification,
  Popover,
  Skeleton,
} from "antd";
import React, { useState } from "react";
import { NotificationOutlined } from "@ant-design/icons";
import notificationAPI from "@/apis/notificationAPI";
import { useEffect } from "react";
import SNAvatar from "@/components/SNAvatar";
import { useContext } from "react";
import { SocketContext } from "@/service/socket/SocketContext";
import InfiniteScroll from "react-infinite-scroll-component";
const Notification = () => {
  const [notificationState, setNotificationState] = useState({});
  const [loading, setLoading] = useState(false);
  const socket = useContext(SocketContext);
  const [currentIndex, setCurrentIndex] = useState(0);
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
      notification.info({
        message: `Thông báo`,
        description:
          "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
        placement: "bottomLeft",
      });
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

  const loadMoreData = async () => {
    console.log("loadmore");
    if (loading) {
      return;
    }
    setLoading(true);
    setCurrentIndex(1);
    notificationAPI
      .getNotify({ index: currentIndex + 1, pageSize: 10 })
      .then((rs) => {
        setNotificationState({
          ...rs.data,
          data: [...notificationState.data, ...rs.data.data],
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Popover
      id="scrollableDiv"
      placement="top"
      title={"Thông báo"}
      overlayInnerStyle={{
        maxWidth: "30rem",
        minWidth: "30rem",
        maxHeight: "50rem",
        overflow: "auto",
      }}
      content={
        notificationState && (
          <InfiniteScroll
            dataLength={notificationState.data?.length ?? 0}
            next={loadMoreData}
            hasMore={
              notificationState.data?.length <
              notificationState.totalNotification
            }
            loader={
              <Skeleton
                className="w-[30rem]"
                avatar
                paragraph={{ rows: 1 }}
                active
              />
            }
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          >
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
          </InfiniteScroll>
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
