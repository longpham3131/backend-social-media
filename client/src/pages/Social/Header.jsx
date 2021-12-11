import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
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
import React, { useRef, useState } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  NotificationOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { getUrlImage } from "@/util/index";
import getFirstLetter from "@/util/getFirstLetter";
import SNCreateEditPost from "@/components/SNCreateEditPost";
import postAPI from "@/apis/postAPI";
import { createPost } from "@/store/postSlice";
const { Header } = Layout;
const Headerbar = ({ collapsed, onToggle }) => {
  let history = useHistory();
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
  const dataFriendResquest = [
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
                dataSource={dataFriendResquest}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <a key="list-loadmore-edit">Chấp nhận</a>,
                      <a key="list-loadmore-more">Hủy</a>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://joeschmoe.io/api/v1/random" />
                      }
                      title={<a href="https://ant.design">{item.title}</a>}
                    />
                  </List.Item>
                )}
              />
            }
            trigger="click"
          >
            <div>
              <Badge count={5}>
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
              <Avatar size={40} src={getUrlImage(myProfile?.avatar)}>
                {getFirstLetter(myProfile?.fullName)}
              </Avatar>
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
