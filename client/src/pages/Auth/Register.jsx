import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Checkbox, message, Upload } from "antd";
import SNUpload from "@/components/SNUpload";
import authAPI from "@/apis/authAPI";
import React from "react";
import chatAPI from "@/apis/chatAPI";
const Register = ({ onSuccess }) => {
  const handleSubmit = async (values) => {
    try {
      const res = await authAPI.register(values);
      console.log("res", res.data);
      const dataRegisterChat = {
        username: values.username,
        first_name: "",
        last_name: values.fullName,
        secret: res.data.hash,
      };
      await chatAPI.registerUser(dataRegisterChat);
      message.success("Register success");
      onSuccess();
    } catch (error) {
      message.error(error.response);
    }
  };

  return (
    <Form
      type="form"
      name="register"
      labelCol={{ span: 9 }}
      wrapperCol={{ span: 15 }}
      labelAlign={"left"}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please enter your username." }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please enter your email." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Full name"
        name="fullName"
        rules={[{ required: true, message: "Please enter your full name." }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password." }]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Confirm password incorrect.",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Confirm password incorrect."));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <div className="w-full text-right">
        <Button type="primary" htmlType="submit" className="bg-green-4">
          Register
        </Button>
      </div>
    </Form>
  );
};
export default Register;
