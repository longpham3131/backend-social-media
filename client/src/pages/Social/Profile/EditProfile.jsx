import { DatePicker, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SNUpload from "@/components/SNUpload";
import { useEffect } from "react";
import moment from "moment";

const EditProfile = ({ visible, onCancel, onEdit }) => {
  const myProfile = useSelector((state) => state.profile);
  const [coverPictureEdit, setCoverPictureEdit] = useState("");
  const [avatarEdit, setAvatarEdit] = useState("");
  const [formEdit] = Form.useForm();
  const handleOk = () => {
    formEdit.submit();
    const { fullName, email, dateOfBirth } = formEdit.getFieldsValue();

    if (fullName && email && dateOfBirth) {
      const dataEmit = { fullName, email, dateOfBirth: dateOfBirth._i };
      dataEmit.avatar = avatarEdit
        ? avatarEdit.response.data.filePath
        : myProfile.avatar;
      dataEmit.avatarForChat = avatarEdit ? avatarEdit.originFileObj : null;
      dataEmit.coverPicture = coverPictureEdit
        ? coverPictureEdit.filePath
        : myProfile.coverPicture;
      onEdit(dataEmit);
    }
  };
  useEffect(() => {
    if (visible) {
      formEdit.setFieldsValue({
        fullName: myProfile.fullName,
        email: myProfile.email,
        dateOfBirth: moment(myProfile.dateOfBirth, "DD/MM/YYYY"),
      });
    }
  }, [visible]);

  return (
    <Modal
      title="Edit personal information"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={"Lưu chỉnh sửa"}
      cancelText={"Hủy"}
    >
      <Form
        form={formEdit}
        layout={"vertical"}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item label={"Ảnh nền"}>
          <SNUpload
            isImagePost={false}
            onUploadSuccess={(value) => setCoverPictureEdit(value)}
            fileProp={myProfile.coverPicture}
          />
        </Form.Item>
        <Form.Item label={"Ảnh đại diện"}>
          <SNUpload
            isImagePost={false}
            onUploadSuccess={(value) => setAvatarEdit(value)}
            fileProp={myProfile.avatar}
          />
        </Form.Item>
        <Form.Item
          label={"Họ và tên"}
          name="fullName"
          rules={[
            {
              required: true,
              message: "Vui lòng điền họ và tên của bạn",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Ngày sinh"}
          name="dateOfBirth"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập ngày sinh của bạn",
            },
          ]}
        >
          <DatePicker
            format={"DD/MM/YYYY"}
            onChange={(date, dateString) => {
              formEdit.setFieldsValue({
                dateOfBirth: moment(dateString, "DD/MM/YYYY"),
              });
            }}
          />
        </Form.Item>
        <Form.Item
          label={"Email"}
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng điền email của bạn",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfile;
