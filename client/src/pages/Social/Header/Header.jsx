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
import React, { useRef, useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

import SNCreateEditPost from "@/components/SNCreateEditPost";

import postAPI from "@/apis/postAPI";

import { createPost } from "@/store/postSlice";
import SNAvatar from "@/components/SNAvatar";
import FriendRequest from "./FriendResquest";
import Notification from "./Notification";
const { Header } = Layout;
const Headerbar = ({ collapsed, onToggle }) => {
  let history = useHistory();
  const refAddEditPost = useRef(null);
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state?.profile);
  const [showCreatePost, setShowCreatePost] = useState(false);

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
        <Link to={`/profile/${myProfile._id}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item>
        <p onClick={logOut}>Log out</p>
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
          {/* Create Post */}
          <Button type="primary" onClick={() => setShowCreatePost(true)}>
            Create Post
          </Button>
          <SNCreateEditPost
            ref={refAddEditPost}
            visible={showCreatePost}
            title="Create Post"
            okText="Create"
            onClose={() => setShowCreatePost(false)}
            onSubmit={handleCreatePost}
          />
          <FriendRequest />

          {/* Danh sách thông báo */}
          <Notification />

          <Dropdown overlay={menu}>
            <div className="flex items-center gap-[0.8rem]">
              <SNAvatar
                size={40}
                src={myProfile?.avatar}
                fullName={myProfile?.fullName}
              />

              <span className=" text-base text-gray-500 hidden lg:block">
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
