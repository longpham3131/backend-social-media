import "./style.scss";
import Dialog from "compoents/Dialog";
import { Select, Form, Upload, Input, DatePicker } from "antd";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUrlImage } from "util/index";
import { clearNotify, updateProfile } from "store/user/user.action";
import moment from "moment";
import Notifications from "compoents/Alert";

const { TextArea } = Input;
const EditProfile = () => {
  //
  const dispatch = useDispatch();

  //Dialog
  const [isShowDialog, setIsShowDialog] = useState(false);

  // Reducer
  const profileReducer = useSelector((state) => state.userReducer.profile);

  // Form
  const [formEditProfile] = Form.useForm();
  const [fullName, setFullName] = useState(profileReducer?.fullName);
  const [avatar, setAvatar] = useState(profileReducer?.avatar);
  const [email, setEmail] = useState(profileReducer?.email);
  const [coverPicture, setCoverPicture] = useState(
    profileReducer?.coverPicture
  );
  const [dateOfBirth, setDateOfBirth] = useState(profileReducer?.dateOfBirth?? moment());

  const [message, setMessage] = useState("");

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      setMessage("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setMessage("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const handleSubmit = () => {
    console.log("VALUES SUBMIT", fullName, email);
    dispatch(
      updateProfile({ fullName, avatar, email, coverPicture, dateOfBirth })
    );
  };
  return (
    <div>
      {/* Notification */}
      <Notifications
        title={"Cập nhật"}
        onSuccess={() => {
          setIsShowDialog(false);
        }}
      />
      <button
        className="btn btn-secondary w-100 mt-3"
        onClick={() => {
          setIsShowDialog(true);
          formEditProfile.setFieldsValue({
            fullName,
            email,
          });
        }}
      >
        Chỉnh sử thông tin
      </button>
      <Dialog
        isShow={isShowDialog}
        handleHideDialog={() => {
          setIsShowDialog(false);
          formEditProfile.resetFields();
        }}
        btnSubmitName={"Cập nhật"}
        form={formEditProfile}
        title={"Chỉnh sửa thông tin"}
        onSubmit={handleSubmit}
        content={
          <Form
            form={formEditProfile}
            onFinish={handleSubmit}
            layout={"horizontal"}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            labelAlign={"left"}
          >
            <Form.Item label={"Ảnh đại diện"}>
              <Upload
                action="https://uploadfile0510.herokuapp.com/api/upload/singleFile"
                listType="picture-card"
                beforeUpload={beforeUpload}
                onPreview={onPreview}
                onChange={({ file }) => {
                  if (file.status === "done") {
                    setMessage("");
                    setAvatar(file?.response?.data?.filePath);
                  }
                }}
                showUploadList={false}
              >
                {avatar ? (
                  <img
                    src={getUrlImage(avatar)}
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  "+ Upload"
                )}
              </Upload>
              {message && <div>{message}</div>}
            </Form.Item>
            <Form.Item label={"Ảnh nền"}>
              <Upload
                action="https://uploadfile0510.herokuapp.com/api/upload/singleFile"
                listType="picture-card"
                beforeUpload={beforeUpload}
                onPreview={onPreview}
                onChange={({ file }) => {
                  if (file.status === "done") {
                    setMessage("");
                    setCoverPicture(file?.response?.data?.filePath);
                  }
                }}
                showUploadList={false}
              >
                {coverPicture ? (
                  <img
                    src={getUrlImage(coverPicture)}
                    alt="coverPicture"
                    style={{ width: "100%" }}
                  />
                ) : (
                  "+ Upload"
                )}
              </Upload>
              {message && <div>{message}</div>}
            </Form.Item>
            <Form.Item
              label={"Họ và tên"}
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Hãy điền họ và tên của bạn",
                },
              ]}
            >
              <Input onChange={(e) => setFullName(e.target.value)} />
            </Form.Item>
            <Form.Item
              label={"Ngày sinh"}
              rules={[
                {
                  required: true,
                  message: "Hãy nhập ngày sinh của bạn",
                },
              ]}
            >
              <DatePicker
                format={"DD/MM/YYYY"}
                defaultValue={moment(dateOfBirth)}
                onChange={(date, dateString) => {
                  setDateOfBirth(dateString);
                }}
              />
            </Form.Item>
            <Form.Item
              label={"Email"}
              name="email"
              rules={[
                {
                  required: true,
                  message: "Hãy điền email của bạn",
                },
              ]}
            >
              <Input onChange={(e) => setEmail(e.target.value)} />
            </Form.Item>
          </Form>
        }
      />
    </div>
  );
};

export default EditProfile;
