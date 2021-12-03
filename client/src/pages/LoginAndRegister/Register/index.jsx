import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "compoents/Dialog";
import { Tabs, Form, Input, Button, Upload } from "antd";
import FormInput from "compoents/Form/Input";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { register } from "store/auth/auth.action";

const Register = () => {
  const dispatch = useDispatch();

  const [isShowDialog, setisShowDialog] = useState(false);

  const [formRegister] = Form.useForm();

  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  const [messageErr, setMessageErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [notifyForm, setNotifyForm] = useState("");

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const registerReducer = useSelector((state) => state.authReducer.register);
  useEffect(() => {
    setNotifyForm("");
    if (registerReducer?.status === 200) {
      NotificationManager.success("Thành công", "Tạo tài khoản");
      formRegister.resetFields();
      setAvatar(null);
      setisShowDialog(false);
    } else if (registerReducer?.status === 400) {
      setNotifyForm(registerReducer?.data?.message);
    }
  }, [registerReducer]);

  const handleSubmit = () => {
    // if (!avatar === "register") {
    //   setMessageErr("Vui lòng chọn ảnh đại diện !");
    //   return;
    // }
    dispatch(register({ username, password, email, fullName }));
  };

  const handleChange = (info) => {
    setAvatar(info.file.originFileObj);
    // setAvatarRgt(null);
    // if (info.file.status === "uploading") {
    //   setLoading(true);
    //   return;
    // }
    // if (info.file.status === "done") {
    //   // Get this url from response in real world.
    //   getBase64(info.file.originFileObj, (avatarRgt) => {
    //     setAvatarRgt(avatarRgt);
    //     setLoading(false);
    //   });
    // }
    // if (info.file.status === "error") {
    //   setLoading(false);
    //   setMessageErr("Upload Image Fail !");
    // }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    setMessageErr("");
    if (!isJpgOrPng) {
      setMessageErr("Ảnh phải thuộc loại JPG/PNG file!");
      // message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setMessageErr("Ảnh phải nhỏ hơn 2MB!");
      // message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  return (
    <div>
      <NotificationContainer />
      <button
        className="btn btn-success w-100"
        onClick={() => {
          setisShowDialog(true);
        }}
      >
        Tạo tài khoản mới
      </button>
      <Dialog
        title={"Đăng ký"}
        isShow={isShowDialog}
        handleHideDialog={() => {
          setisShowDialog(false);
        }}
        form={formRegister}
        btnSubmitName={"Đăng ký"}
        onSubmit={handleSubmit}
        content={
          <Form
            type="form"
            name="register"
            form={formRegister}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}
            labelAlign={"left"}
            onFinish={handleSubmit}
          >
            <Form.Item label="Ảnh đại diện" name="avatar">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {avatar ? (
                  // <img
                  //   src={URL.createObjectURL(avatar)}
                  //   alt="avatar"
                  //   style={{ width: "100%" }}
                  // />
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: `url(${URL.createObjectURL(avatar)})`,
                    }}
                  ></div>
                ) : (
                  uploadButton
                )}
              </Upload>
              <span className="error">{messageErr}</span>
            </Form.Item>
            <Form.Item
              label="Tài khoản"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
            >
              <Input onChange={(e) => setUsername(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email" }]}
            >
              <Input onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="Tên đầy đủ"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng tên" }]}
            >
              <Input onChange={(e) => setFullName(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              hasFeedback
            >
              <Input.Password onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="Nhập lại mật khẩu"
              name="confirmpassword"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận lại mật khẩu",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* <Form.Item label="First name" name="fname">
              <Input onChange={(e) => setFname(e.target.value)} />
            </Form.Item>

            <Form.Item label="Last name" name="lname">
              <Input onChange={(e) => setLname(e.target.value)} />
            </Form.Item> */}

            {/* <Form.Item wrapperCol={{ offset: 20, span: 20 }}>
              <Button type="primary" htmlType="submit">
                Đăng ký
              </Button>
            </Form.Item> */}

            <p
              style={{
                display: notifyForm !== "" ? "block" : "none",
                color: "red",
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              Thông báo: {notifyForm}
            </p>
          </Form>
        }
      />
    </div>
  );
};
export default Register;

{
  /* <form>
            <FormInput
              type={"text"}
              label={"Tài khoản"}
              validate={"username"}
              onChangeValue={(value) => {
                setUsername(value);
                setValidForm(true);
              }}
              isInputValid={(res) => {
                setValidForm(validForm && res);
              }}
            />
            <FormInput
              type={"email"}
              label={"Email"}
              validate={"email"}
              onChangeValue={(value) => {
                setEmail(value);
                setValidForm(true);
              }}
              isInputValid={(res) => {
                setValidForm(validForm && res);
              }}
            />
            <FormInput
              type={"password"}
              label={"Mật khẩu"}
              validate={"password"}
              onChangeValue={(value) => {
                setPassword(value);
                setValidForm(true);
              }}
              isInputValid={(res) => {
                setValidForm(validForm && res);
              }}
            />
          </form> */
}
