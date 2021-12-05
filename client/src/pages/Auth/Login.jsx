import { Form, Input, Button, Checkbox, message } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "store/auth/auth.action";
import jwt_decode from "jwt-decode";
import authAPI from "apis/authAPI";
const Login = () => {
  const dispatch = useDispatch();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //   useEffect(() => {
  //     setNotifyForm("");
  //     if (loginReducer?.status === 200) {
  //       localStorage.setItem("token", loginReducer?.data?.accessToken);

  //       const decodeJWT = jwt_decode(loginReducer?.data?.accessToken);

  //       localStorage.setItem("userId", decodeJWT?.userId);

  //       dispatch(userAPI.getProfile(decodeJWT?.userId));

  //       history.push("/");

  //       window.location.reload();
  //     } else if (loginReducer?.status === 400) {
  //       setNotifyForm(loginReducer?.data?.message);
  //     }
  //   }, [loginReducer]);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   dispatch(login(username, password));
  // };

  const onFinish = async (values) => {
    try {
      await authAPI.login(values);
      message.success("Đăng nhập thành công");
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
