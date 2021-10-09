import { Modal, Button } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "react-loader-spinner";
const Dialog = ({
  type = "form",
  title = "",
  isShow,
  handleHideDialog,
  content = "",
  btnSubmitName = "Xác nhận",
  onSubmit,
}) => {
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    if (isShow) {
      setisLoading(true);
    }
  }, [isShow]);
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
