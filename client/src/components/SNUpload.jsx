import React, { useEffect, useState } from "react";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getUrlImage } from "@/util/index";

export default function SNUpload({
  isImagePost = true,
  onUploadSuccess,
  fileProp,
}) {
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.info("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.info("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const [loading, setLoading] = useState(false);
  const handleChangeAvatar = ({ file }) => {
    setLoading(true);
    if (file.status === "done") {
      // setAvatar(file?.response?.data?.filePath);

      onUploadSuccess(file);
      setLoading(false);
    } else if (file.status === "error") {
      setLoading(false);
      message.error("Upload fail");
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Upload
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://uploadfile0510.herokuapp.com/api/upload/singleFile"
      beforeUpload={beforeUpload}
      onChange={handleChangeAvatar}
    >
      {!loading && fileProp ? (
        <img
          src={
            isImagePost
              ? getUrlImage(fileProp.file ?? fileProp.response.data.filePath)
              : getUrlImage(fileProp)
          }
          alt="avatar"
          className="w-full h-full"
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}
