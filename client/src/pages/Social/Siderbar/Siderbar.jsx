import React, { useEffect } from "react";
import { Layout, Menu, Drawer, List } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  SearchOutlined,
  AliwangwangOutlined,
  DesktopOutlined,
  DeploymentUnitOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import SNAvatar from "@/components/SNAvatar";
import "./styles.scss";
const { Sider } = Layout;
const Siderbar = ({ collapsed, onClose }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const sizeIcon = 30;

  const profile = useSelector((state) => state.profile);
  useEffect(() => {
    setActiveTab([location.pathname]);
  }, [location.pathname]);
  return (
    <>
      {/* Sidebar cho web */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={300}
        theme={"light"}
        className="hidden lg:block slider-bar-custom"
      >
        <Menu mode="inline" selectedKeys={activeTab} className="pt-[32px]">
          <Menu.Item
            key={`/profile/${profile?._id}`}
            icon={<SNAvatar size={70} src={profile?.avatar} />}
          >
            <Link
              to={`/profile/${profile?._id}`}
              className=" font-bold sider-item ml-[10px] text-[20px]"
            >
              {profile?.fullName}
            </Link>
          </Menu.Item>

          {/* <hr className="w-[90%] my-[1rem]" /> */}
          <Menu.Item
            key="/"
            icon={<DesktopOutlined style={{ fontSize: `${sizeIcon}px` }} />}
          >
            <Link to="/" className=" font-bold sider-item">
              Newsfeed
            </Link>
          </Menu.Item>

          <Menu.Item
            key="/members"
            icon={<TeamOutlined style={{ fontSize: `${sizeIcon}px` }} />}
          >
            <Link to="/members" className=" font-bold">
              Members
            </Link>
          </Menu.Item>
          <Menu.Item
            key="/groups"
            icon={
              <DeploymentUnitOutlined style={{ fontSize: `${sizeIcon}px` }} />
            }
          >
            <Link to="/groups" className=" font-bold">
              Groups
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      {/* Sidebar cho mobile */}
      {/* <Drawer
        title="Social Network"
        placement={"left"}
        onClose={onClose}
        visible={collapsed}
        className="lg:hidden block"
      >
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
      </Drawer> */}
    </>
  );
};

export default Siderbar;
