import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Form,
  Input,
  Layout,
  List,
  Menu,
  message,
  Popover,
} from "antd";
import React, { useRef, useState, useEffect } from "react";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import logo from "@/assets/images/cropped-logovikinger.png"
import SNCreateEditPost from "@/components/SNCreateEditPost";

import postAPI from "@/apis/postAPI";

import { createPost } from "@/store/postSlice";
import SNAvatar from "@/components/SNAvatar";
import FriendRequest from "./FriendResquest";
import Notification from "./Notification";
import userAPI from "@/apis/userAPI";
import Searchbar from "./Searchbar";
const { Header } = Layout;
const Headerbar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state?.profile);
  const logOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key={"logOut"}>
        <p onClick={logOut}>Log out</p>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    checkInAtivity();
  }, []);

  const checkInAtivity = async () => {
    try {
      await userAPI.checkInAtivity();
    } catch (err) {
      if (+err.response.statu == +401) logOut();
    }
  };

  return (
    <Header
      className="bg-color-header-background h-[80px] flex items-center justify-between"
      style={{ padding: 0 }}
    >
      <div className="flex items-center justify-between mx-[1.6rem] w-full">
        {/* Logo */}
        <div className="flex justify-center items-center gap-[1rem]">
          <img
            src={logo}
            alt="logo"
            className="mx-auto"
          />
          <p className=" font-secondary font-bold text-[1.25rem] text-white leading-[1em]">
            VIKINGER
          </p>
          <AppstoreOutlined
            style={{
              fontSize: "20px",
              color: collapsed ? "var(--color-header-icon)" : "#fff",
            }}
            onClick={onToggle}
          />
        </div>

        <Searchbar />

        <div className="flex items-center gap-[2rem]">
          {/* Create Post */}

          <FriendRequest />

          {/* Danh sách thông báo */}
          <Notification />

          <Dropdown overlay={menu}>
            <SettingOutlined style={{ fontSize: "20px", color: "#fff" }} />
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};
export default Headerbar;
