import { DatePicker, Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SNUpload from "@/components/SNUpload";
import { useEffect } from "react";
import moment from "moment";

const EditProfile = ({ visible, onCancel, onEdit }) => {
  const myProfile = useSelector((state) => state.profile);
  const [coverPictureEdit, setCoverPictureEdit] = useState(null);
  const [avatarEdit, setAvatarEdit] = useState(null);
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
        ? coverPictureEdit.response.data.filePath
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
      okText={"Save"}
      cancelText={"Cancel"}
    >
      <Form
        form={formEdit}
        layout={"vertical"}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item label={"Background picture"}>
          <SNUpload
            isImagePost={coverPictureEdit ? true : false}
            onUploadSuccess={(value) => setCoverPictureEdit(value)}
            fileProp={coverPictureEdit ?? myProfile.coverPicture}
          />
        </Form.Item>
        <Form.Item label={"Avatar"}>
          <SNUpload
            isImagePost={avatarEdit ? true : false}
            onUploadSuccess={(value) => setAvatarEdit(value)}
            fileProp={avatarEdit ?? myProfile.avatar}
          />
        </Form.Item>
        <Form.Item
          label={"Fullname"}
          name="fullName"
          rules={[
            {
              required: true,
              message: "Please enter your full name.",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Date of birth"}
          name="dateOfBirth"
          rules={[
            {
              required: true,
              message: "Please enter your birthday.",
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
              message: "Please enter your email.",
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
