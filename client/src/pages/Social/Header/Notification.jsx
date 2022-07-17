import {
  Divider,
  Badge,
  List,
  message,
  notification,
  Popover,
  Skeleton,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { NotificationOutlined } from "@ant-design/icons";
import notificationAPI from "@/apis/notificationAPI";
import { useEffect } from "react";
import SNAvatar from "@/components/SNAvatar";
import { useContext } from "react";
import { SocketContext } from "@/service/socket/SocketContext";
import { formatMinutes, getFirstWord } from "@/util/index";
import InfiniteScroll from "react-infinite-scroll-component";
import userAPI from "@/apis/userAPI";
import { setProfile } from "@/store/profileSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import { EyeOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { setModalPost } from "@/store/modalPostSlice";

const Notification = () => {
  const navigate = useNavigate();
  const [notificationState, setNotificationState] = useState({});
  const [loading, setLoading] = useState(false);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    fetchNoti();
  }, []);

  const fetchNoti = async () => {
    try {
      const res = await notificationAPI.getNotify();
      setNotificationState(res.data);
      console.log("noti", res.data);
    } catch {
      message.error("Get notification fail");
    }
  };
  const fetchInfoUser = async () => {
    const myProfile = await userAPI.getMyProfile();
    dispatch(setProfile(myProfile.data.data));
  };
  useEffect(() => {
    socket.on("notification", (msg) => {
      fetchNoti();
      if (msg.type === 0) {
        fetchInfoUser();
      }
      // noti socket io : type = 0: user, type = 1: post , type = 2: group
      notification.info({
        message: `Notification`,
        className: "cursor-pointer",
        description: (
          <div
            className="flex gap-[10px] items-center cursor-pointer mt-[15px]"
            onClick={() => {
              msg.type === 0
                ? navigate(`/profile/${msg.fromUser._id}`)
                : msg.type === 1
                ? dispatch(setModalPost({ postId: msg.postId, show: true }))
                : navigate(`/groups/${msg.groupId}`);
            }}
          >
            <SNAvatar src={msg.fromUser.avatar} className="mr-2" size={50} />
            <p className="font-bold">
              {msg.fromUser.fullName}{" "}
              <span className="font-medium"> {msg.mess}</span>{" "}
            </p>
          </div>
        ),
        placement: "bottomLeft",
      });
    });
  }, []);

  const descriptionNoti = (type) => {
    switch (type) {
      case 1:
        return "liked your post.";
      case 2:
        return "commented on your post.";
      case 3:
        return "shared your post.";
      case 4:
        return "liked your commment.";
      case 5:
        return "replied to your comment.";
      case 6:
        return "has invited you to the group.";
      case 7:
        return "approved you to be a member of the group.";
      default:
        return "accepted your friend request.";
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
  const isSeenNoti = (statusNoti) => statusNoti === 1;
  const notificationSeen = async (id) => {
    console.log("id", id);
    await notificationAPI.seenNotify(id);
    const res = await notificationAPI.getNotify();
    setNotificationState(res.data);
  };
  const handleRedirect = (noti) => {
    if (noti.type === 6 || noti.type === 7) {
      navigate(`/groups/${noti.data._id}`);
    } else {
      dispatch(setModalPost({ show: true, postId: noti.postId }));
    }
  };
  return (
    <Popover
      id="scrollableDiv"
      placement="top"
      title={"Notification"}
      overlayInnerStyle={{
        maxWidth: "30rem",
        minWidth: "30rem",
        maxHeight: "500px",
        overflow: "auto",
      }}
      overlayClassName="sn-notifications"
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
                <div
                  className=" cursor-pointer"
                  onClick={() => handleRedirect(item)}
                >
                  <div
                    className={classNames("p-[12px]", {
                      "bg-[#eae6ee]": !isSeenNoti(item.status),
                    })}
                    onClick={() => {
                      notificationSeen(item._id);
                    }}
                  >
                    <SNWidgetBoxItem
                      srcAvatar={item.fromUser.avatar}
                      name={
                        <>
                          {item.fromUser.fullName}{" "}
                          <span className=" font-medium">
                            {descriptionNoti(item.type)}
                          </span>{" "}
                          {item.type === 6 || item.type === 7 ? (
                            <span className="font-bold">
                              {item.data.groupName}
                            </span>
                          ) : (
                            ""
                          )}
                        </>
                      }
                      description={formatMinutes(item.createAt)}
                      leftIcon={isSeenNoti(item.status) ? "" : <EyeOutlined />}
                    />
                  </div>
                </div>
              )}
            />
          </InfiniteScroll>
        )
      }
      trigger="click"
    >
      <div>
        <Badge count={notificationState.countNotification}>
          <NotificationOutlined style={{ fontSize: "20px", color: "#fff" }} />
        </Badge>
      </div>
    </Popover>
  );
};

export default Notification;
