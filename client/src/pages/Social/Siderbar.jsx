import React from 'react';
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
const { Sider } = Layout;
const Siderbar = ({ collapsed }) => {
  //   const [, setCollapsed] = useState(false);
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={300}
      theme={"light"}
    >
      <div className="logo" />
      <Menu mode="inline" defaultSelectedKeys={["1"]}>
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
  );
};

export default Siderbar;
