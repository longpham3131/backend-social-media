import { Modal, Button } from "antd";
import { useState } from "react";
import { useEffect } from "react";

const Dialog = ({
  type = "form",
  title = "",
  isShow,
  handleHideDialog,
  content = "",
  btnSubmitName = "Xác nhận",
  onSubmit,
}) => {
  const customFooter = () => {
    return (
      <div>
        <Button
          danger
          onClick={() => {
            handleHideDialog();
          }}
        >
          Đóng
        </Button>
        <Button type="primary" onClick={onSubmit} htmlType="submit">
          {btnSubmitName}
        </Button>
      </div>
    );
  };

  return (
    <Modal
      visible={isShow}
      title={title}
      closable={false}
      centered={true}
      footer={type === "file" ? null : customFooter()}
      onCancel={() => {
        handleHideDialog();
      }}
    >
      {content}
    </Modal>
  );
};

export default Dialog;
