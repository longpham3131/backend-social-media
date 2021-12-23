import React, { useEffect } from "react";
import { Layout, Menu, Drawer, List } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  SearchOutlined,
  AliwangwangOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import SNAvatar from "@/components/SNAvatar";
const { Sider } = Layout;
const Siderbar = ({ collapsed, onClose }) => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(history.location.pathname);

  const profile = useSelector((state) => state.profile);
  useEffect(() => {
    setActiveTab([history.location.pathname]);
  }, [history.location.pathname]);
  return (
    <>
      {/* Sidebar cho web */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={300}
        theme={"light"}
        className="hidden lg:block"
      >
        <div className="logo" />
        <Menu mode="inline" selectedKeys={activeTab}>
          <Menu.Item key="/" icon={<UserOutlined />}>
            <Link to="/">News feed</Link>
          </Menu.Item>
          <Menu.Item key="/search-friend" icon={<SearchOutlined />}>
            <Link to="/search-friend">Find your friends</Link>
          </Menu.Item>
          <Menu.Item key="/message" icon={<AliwangwangOutlined />}>
            <Link to="/message">Messages</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      {/* Sidebar cho mobile */}
      <Drawer
        title="Social Network"
        placement={"left"}
        onClose={onClose}
        visible={collapsed}
        className="lg:hidden block"
      >
        <div className="logo" />
        <p className="mb-[1.2rem] text-md font-quicksand font-semi-bold text-gray-5 text-center">
          Menu
        </p>
        <Menu mode="inline" selectedKeys={activeTab}>
          <Menu.Item key="/" icon={<UserOutlined />}>
            <Link to="/">News feed</Link>
          </Menu.Item>
          <Menu.Item key="/search-friend" icon={<SearchOutlined />}>
            <Link to="/search-friend">Find your friends</Link>
          </Menu.Item>
          <Menu.Item key="/message" icon={<AliwangwangOutlined />}>
            <Link to="/message">Messages</Link>
          </Menu.Item>
        </Menu>
        <div className="px-[1.2rem] mt-[1rem]">
          {profile.friends && profile.friends.length > 0 ? (
            <>
              <p className="mb-[1.2rem] text-md font-quicksand font-semi-bold text-gray-5 text-center">
                Friends List
              </p>
              <List
                itemLayout="horizontal"
                dataSource={profile.friends}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <SNAvatar
                          src={item.user.avatar}
                          fullName={item.user.fullName}
                        />
                      }
                      title={
                        <Link to={`/profile/${item.user._id}`}>
                          {item.user.fullName}
                        </Link>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          ) : (
            <p className="mb-[1.2rem] text-md font-quicksand font-semi-bold text-gray-5 text-center">
              Friends List is empty.
            </p>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default Siderbar;
