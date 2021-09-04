import { Modal, Button } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "react-loader-spinner";
const Dialog = ({
  type = "form",
  title = "",
  content = "",
  isShow,
  handleHideDialog,
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
        <Button type="primary" onClick={onSubmit}>
          {btnSubmitName}
        </Button>
      </div>
    );
  };

  const onRenderContent = () => {
    if (type === "file") {
      return (
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "45%",
              right: "45%",
              visibility: isLoading ? "visible" : "hidden",
            }}
          >
            <Loader type="Oval" color="#7554a0" height={50} width={50} />
          </div>
          <img
            src={content}
            alt="img"
            className="w-100"
            style={{
              backgroundColor: "#c3c3c3",
              height: isLoading ? "300px" : "unset",
            }}
            onLoad={() => {
              setisLoading(false);
            }}
          />
        </div>
      );
    }

    return content;
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
      {onRenderContent()}
    </Modal>
  );
};

export default Dialog;
