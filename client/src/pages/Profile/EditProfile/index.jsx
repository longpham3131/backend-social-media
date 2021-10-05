import "./style.scss";
import Dialog from "compoents/Dialog";
import { Select, Form } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
const EditProfile = () => {
  //Dialog
  const [isShowDialog, setIsShowDialog] = useState(false);

  // Reducer
  const profileReducer = useSelector((state) => state.userReducer.profile.data);

  // Form
  const [formEditProfile] = Form.useForm();

  const handleSubmit = () => {};
  return (
    <div>
      <Dialog
        isShow={isShowDialog}
        handleHideDialog={() => {
          setIsShowDialog(false);
        }}
        btnSubmitName={"Cập nhật"}
        form={formEditProfile}
        title={"Chỉnh sửa thông tin"}
        onSubmit={handleSubmit}
        content={<Form form={formEditProfile} onFinish={handleSubmit}></Form>}
      />
    </div>
  );
};

export default EditProfile;
