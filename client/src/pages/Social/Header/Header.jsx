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
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import SNCreateEditPost from "@/components/SNCreateEditPost";

import postAPI from "@/apis/postAPI";

import { createPost } from "@/store/postSlice";
import SNAvatar from "@/components/SNAvatar";
import FriendRequest from "./FriendResquest";
import Notification from "./Notification";
import Modal from "antd/lib/modal/Modal";
import userAPI from "@/apis/userAPI";
import { changePassword } from "@/store/profileSlice";
import chatAPI from "@/apis/chatAPI";
import Searchbar from "./Searchbar";
const { Header } = Layout;
const Headerbar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const refAddEditPost = useRef(null);
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state?.profile);

  const [openModalPass, setOpenModalPass] = useState(false);
  const { groupId } = useParams();
  const [form] = Form.useForm();

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChangePassword = async (values) => {
    try {
      const res = await userAPI.updatePassword(values);
      const resChat = await chatAPI.getUser();
      const userChatId = resChat.data.find(
        (user) => user.username === myProfile.username
      ).id;
      await chatAPI.changePassword(userChatId, res.data.hashedPassword);
      form.resetFields();
      dispatch(changePassword(res.data.hashedPassword));
      setOpenModalPass(false);
      message.success("Update password success.");
    } catch (err) {
      message.error(err.response.data.message);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to={`/profile/${myProfile._id}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item>
        <p onClick={() => setOpenModalPass(true)}>Change your password</p>
      </Menu.Item>
      <Menu.Item>
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
            src="images/cropped-logovikinger.png"
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
          <Modal
            title="Change password"
            visible={openModalPass}
            onCancel={() => setOpenModalPass(false)}
            footer={null}
          >
            <Form
              form={form}
              onFinish={handleChangePassword}
              layout={"vertical"}
            >
              <Form.Item
                label="Old password"
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter your old password.",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="New password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter your new password.",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Confirm password incorrect.",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Confirm password incorrect.")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <div className="w-full flex gap-[0.8rem] justify-end">
                <Button onClick={() => setOpenModalPass(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" className="bg-green-4">
                  Save
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </Header>
  );
};
export default Headerbar;
