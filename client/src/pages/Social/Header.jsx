import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Layout,
  List,
  Menu,
  message,
  Popover,
} from "antd";
import React, { useRef, useContext, useEffect, useState } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  NotificationOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { SocketContext } from "@/service/socket/SocketContext.jsx";
import defaultAvatar from "@/assets/images/default-avatar.jpg";
import { getUrlImage } from "@/util/index";
import getFirstLetter from "@/util/getFirstLetter";
import SNCreateEditPost from "@/components/SNCreateEditPost";
import { setProfile } from "@/store/profileSlice";
import postAPI from "@/apis/postAPI";
import userAPI from "@/apis/userAPI";
import { createPost } from "@/store/postSlice";
import SNAvatar from "@/components/SNAvatar";
const { Header } = Layout;
const Headerbar = ({ collapsed, onToggle }) => {
  let history = useHistory();
  const socket = useContext(SocketContext);
  const refAddEditPost = useRef(null);
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state?.profile);
  const [showCreatePost, setShowCreatePost] = useState(false);
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
  const handleFriendRequestRespone = async ({ userId, type }) => {
    let result = await userAPI.friendRespone({
      userId,
      type,
    });
    const myProfile = await userAPI.getMyProfile();
    dispatch(setProfile(myProfile.data.data));
  };
  const logOut = () => {
    localStorage.clear();
    history.push("/login");
    window.location.reload();
  };
  const handleCreatePost = async (values) => {
    try {
      const res = await postAPI.createPost(values);
      console.log("success", res.data);
      dispatch(createPost(res.data));
      message.success("Đăng bài viết thành công.");
      refAddEditPost.current.resetFields();
      setShowCreatePost(false);
    } catch {
      message.error("Đăng bài viết thất bại!");
    }
    console.log("Submit values", values);
  };
  const menu = (
    <Menu>
      <Menu.Item>
        <p>Trang cá nhân</p>
      </Menu.Item>
      <Menu.Item>
        <p onClick={logOut}>Đăng xuất</p>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    console.log('1')
    if (myProfile == null && !myProfile._id) return;
    console.log('2')
    socket.emit("leave-all-and-join-room", "user_" + myProfile?._id);
   
  }, [myProfile]);
  useEffect(() => {
    socket.on("friendRequest", (msg) => {
      console.log("messs-notify", msg);
    });
  }, []);
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      <div className="flex items-center justify-between mx-[1.6rem]">
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: onToggle,
          }
        )}
        <div className="flex items-center gap-[2rem]">
          {/* Tạo bài viết */}
          <Button type="primary" onClick={() => setShowCreatePost(true)}>
            Tạo bài viết
          </Button>
          <SNCreateEditPost
            ref={refAddEditPost}
            visible={showCreatePost}
            title="Tạo bài viết"
            okText="Đăng bài viết"
            onClose={() => setShowCreatePost(false)}
            onSubmit={handleCreatePost}
          />
          {/* Danh sách yêu cầu kết bạn */}
          <Popover
            placement="bottom"
            title={"Kết bạn"}
            overlayInnerStyle={{
              minWidth: "40rem",
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
                      <a
                        key="list-loadmore-edit"
                        onClick={() =>
                          handleFriendRequestRespone({
                            userId: item.user._id,
                            type: 1,
                          })
                        }
                      >
                        Chấp nhận
                      </a>,
                      <a
                        key="list-loadmore-more"
                        onClick={() =>
                          handleFriendRequestRespone({
                            userId: item.user._id,
                            type: 0,
                          })
                        }
                      >
                        Hủy
                      </a>,
                    ]}
                  >
                    <Link to={`/profile/${item.user._id}`}>
                      <List.Item.Meta
                        avatar={
                          <SNAvatar
                            src={
                              item.user.avatar != ""
                                ? getUrlImage(item.user.avatar)
                                : defaultAvatar
                            }
                          />
                        }
                        title={
                          <p className="overflow-hidden overflow-ellipsis whitespace-nowrap w-[200px] mt-2">
                            {item.user.fullName}
                          </p>
                        }
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
                <UsergroupAddOutlined style={{ fontSize: "20px" }} />
              </Badge>
            </div>
          </Popover>
          {/* Danh sách thông báo */}
          <Popover
            placement="bottom"
            title={"Thông báo"}
            overlayInnerStyle={{
              minWidth: "30rem",
              maxHeight: "50rem",
              overflow: "auto",
            }}
            content={
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://joeschmoe.io/api/v1/random" />
                      }
                      title={<a href="https://ant.design">{item.title}</a>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                  </List.Item>
                )}
              />
            }
            trigger="click"
          >
            <div>
              <Badge count={5}>
                <NotificationOutlined style={{ fontSize: "20px" }} />
              </Badge>
            </div>
          </Popover>

          <Dropdown overlay={menu}>
            <div className="flex items-center gap-[0.8rem]">
              <SNAvatar
                size={40}
                src={myProfile?.avatar}
                fullName={myProfile?.fullName}
              />

              <span className=" text-base text-gray-500">
                {myProfile?.fullName}
              </span>
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};
export default Headerbar;
