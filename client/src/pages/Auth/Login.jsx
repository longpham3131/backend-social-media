import { Form, Input, Button, Checkbox, message } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, loginAction } from "store/auth/auth.action";
import jwt_decode from "jwt-decode";
import authAPI from "apis/authAPI";
import userAPI from "apis/userAPI";
import { getMyProfileAction } from "store/user/user.action";
const Login = () => {
  
  let history = useHistory();

  const onFinish = async (values) => {
    try {
      const res = await authAPI.login(values);
      await localStorage.setItem("token", res.data.accessToken);
      history.push("/newsfeed")
      window.location.reload();
      
    } catch (error) {
      message.error(error.response);
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
        label="Tài khoản"
        name="username"
        rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu." }]}
      >
        <Input.Password />
      </Form.Item>

      {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 16 }}>
        <Checkbox>Lưu tài khoản</Checkbox>
      </Form.Item> */}

      <div className="w-full text-right">
        <Button type="primary" htmlType="submit" className="bg-green-4">
          Đăng nhập
        </Button>
      </div>
    </Form>
  );
};

export default Login;
