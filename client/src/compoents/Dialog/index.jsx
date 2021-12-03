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
  btnSubmit = true,
  btnClose = true,
  useFooter = true,
  width = undefined,
}) => {
  const customFooter = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <Modal
      visible={isShow}
      title={title}
      closable={false}
      centered={true}
      width={width}
      footer={type === "file" || useFooter == false ? null : customFooter()}
      onCancel={() => {
        handleHideDialog();
      }}
    >
      {content}
    </Modal>
  );
};

export default Dialog;
