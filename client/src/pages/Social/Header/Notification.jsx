import {
  Divider,
  Badge,
  List,
  message,
  notification,
  Popover,
  Skeleton,
} from "antd";
import { useHistory, Link } from "react-router-dom";
import React, { useState } from "react";
import { NotificationOutlined } from "@ant-design/icons";
import notificationAPI from "@/apis/notificationAPI";
import { useEffect } from "react";
import SNAvatar from "@/components/SNAvatar";
import { useContext } from "react";
import { SocketContext } from "@/service/socket/SocketContext";
import { formatMinutes, getFirstWord } from "@/util/index";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
const Notification = () => {
  const history = useHistory();
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
      console.log("messs-notify", msg.data);
      fetchNoti();
      // Không hiện thông báo khi dislike (-2)
      if (msg.data.type !== -1 && msg.data.type !== -4) {
        notification.info({
          message: `Thông báo`,
          description: (
            <div onClick={() => history.push(`/post/${msg.data.postId}`)}>
              <SNAvatar
                src={msg.data.fromUser.avatar}
                className="mr-2"
                // fullName={msg.data.fromUser.fullName}
              />
              <span>{getFirstWord(msg.data.fromUser.fullName)} </span>
              {descriptionNoti(msg.data.type)}
            </div>
          ),
          placement: "bottomLeft",
        });
      }
    });
  }, []);

  const descriptionNoti = (type) => {
    switch (type) {
      case 1:
        return "Liked your post.";
      case 2:
        return "Commented on your post.";
      case 3:
        return "Shared your post.";
      case 4:
        return "Liked your commment.";
      case 5:
        return "Replied to your comment.";
      default:
        return "Accepted your friend request.";
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

  const notificationSeen = async (id) => {
    console.log('id',id)
    await notificationAPI.seenNotify(id);
    const res = await notificationAPI.getNotify();
    setNotificationState(res.data);
  };

  return (
    <Popover
      id="scrollableDiv"
      placement="top"
      title={"Notification"}
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
                <Link to={`/post/${item.postId}`}>
                  <List.Item
                    onClick={() => notificationSeen(item._id)}
                    // actions={[
                    //   <a key="list-loadmore-edit">

                    //   </a>,
                    // ]}
                    className=""
                  >
                    <List.Item.Meta
                      avatar={
                        <SNAvatar
                          src={item.fromUser.avatar}
                          fullName={item.fromUser.fullName}
                        />
                      }
                      title={<span className={item.status==1?"":"text-green-primary"}>{item.fromUser.fullName}</span>}
                      description={
                        <div className={item.status==1?"":"text-green-primary"}>
                          <div>{descriptionNoti(item.type)}</div>
                          <div>{formatMinutes(item.createAt)}</div>
                        </div>
                      }
                    />
                  </List.Item>
                </Link>
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
