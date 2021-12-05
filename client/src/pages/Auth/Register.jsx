import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Checkbox, message, Upload } from "antd";
import SNUpload from "components/SNUpload";
import authAPI from "apis/authAPI";
const Register = ({ onSuccess }) => {
  const [avatar, setAvatar] = useState("");
  const handleSubmit = async (values) => {
    try {
      await authAPI.register(values);
      message.success("Đăng ký thành công");
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
      <Form.Item label="Ảnh đại diện" name="avatar">
        <SNUpload onUploadSuccess={(value) => setAvatar(value)} />
      </Form.Item>
      <Form.Item
        label="Tài khoản"
        name="username"
        rules={[{ required: true, message: "Vui lòng nhập tài khoản." }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Vui lòng nhập email." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Tên đầy đủ"
        name="fullName"
        rules={[{ required: true, message: "Vui lòng nhập tên." }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu." }]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Nhập lại mật khẩu"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Vui lòng xác nhận lại mật khẩu.",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu không khớp."));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <div className="w-full text-right">
        <Button type="primary" htmlType="submit" className="bg-green-4">
          Đăng ký
        </Button>
      </div>
    </Form>
  );
};
export default Register;
