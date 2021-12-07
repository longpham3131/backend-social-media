import {
  Avatar,
  Layout,
  Menu,
  message,
  Dropdown,
  Badge,
  Popover,
  List,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  NotificationOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import "./styles/index.scss";
import { getMyProfileAction } from "store/user/user.action";
import userAPI from "apis/userAPI";
import { useDispatch, useSelector } from "react-redux";
import getFirstLetter from "util/getFirstLetter";
import { getUrlImage } from "util/index";
import { Route, Switch, useHistory } from "react-router";
import Newsfeed from "./Newsfeed";
import SearchFriend from "./SearchFriend";
import { Link } from "react-router-dom";
import Profile from "./Profile";

const { Header, Sider, Content } = Layout;

const Social = ({ match }) => {
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state?.userReducer?.myProfile);
  const [collapsed, setCollapsed] = useState(false);
  let history = useHistory();
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  const logOut = () => {
    localStorage.clear();
    history.push("/login");
    window.location.reload();
  };
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      const myProfile = await userAPI.getMyProfile();
      dispatch(getMyProfileAction(myProfile.data));
      message.success("Chào mừng bạn quay lại");
    } catch (error) {
      console.log("error-newsfeed", error);
    }
  }, []);
  return (
    <Layout className="w-full h-screen newsfeed">
      <Sider trigger={null} collapsible collapsed={collapsed} width={300}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link to="/newsfeed">Bảng tin</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            <Link to="/newsfeed/profile">Trang cá nhân</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            <Link to="/newsfeed/search-friend">Tìm kiếm bạn bè</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <div className="flex items-center justify-between mx-[1.6rem]">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: toggle,
              }
            )}
            <div className="flex items-center gap-[2rem]">
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
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",

            minHeight: 280,
          }}
        >
          <div className="flex justify-between w-full h-full">
            <div className="h-full w-[75%] p-[2.4rem]">
              <Route
                path="/newsfeed"
                render={(props) => <Newsfeed {...props} />}
                exact
              />
              <Route
                path="/newsfeed/profile"
                render={(props) => <Profile {...props} />}
              />
              <Route
                path="/newsfeed/search-friend"
                render={(props) => <SearchFriend {...props} />}
              />
            </div>
            <div className="border-l-4 border-indigo-600 h-full w-[25%] p-[2.4rem]"></div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Social;
