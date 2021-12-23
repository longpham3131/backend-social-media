import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  SearchOutlined,
  AliwangwangOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
const { Sider } = Layout;
const Siderbar = ({ collapsed }) => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(history.location.pathname);
  useEffect(() => {
    setActiveTab([history.location.pathname]);
  }, [history.location.pathname]);
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={300}
      theme={"light"}
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
  );
};

export default Siderbar;
