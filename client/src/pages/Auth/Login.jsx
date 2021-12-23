import { Form, Input, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import authAPI from "@/apis/authAPI";
import React from "react";
const Login = () => {
  let history = useHistory();

  const onFinish = async (values) => {
    try {
      const res = await authAPI.login(values);
      await localStorage.setItem("token", res.data.accessToken);
      history.push("/");
      window.location.reload();
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return (
    <Form
      name="basic"
      wrapperCol={{ span: 24 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please enter your username." }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your passoword." }]}
      >
        <Input.Password />
      </Form.Item>

      {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 16 }}>
        <Checkbox>Lưu tài khoản</Checkbox>
      </Form.Item> */}

      <div className="w-full text-right">
        <Button type="primary" htmlType="submit" className="bg-green-4">
          Login
        </Button>
      </div>
    </Form>
  );
};

export default Login;
