import DefaultAvatar from "assets/images/default-avatar.jpg";
import { useSelector } from "react-redux";
import { getUrlImage } from "util/index";
import Comment from "./Comment";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import "./style.scss";
import { useEffect, useRef, useState } from "react";
import { Upload } from "antd";

const CommentList = ({ isShow, isFocusInput }) => {
  //GENERATE
  const profileReducer = useSelector((state) => state.userReducer.profile);
  const inputRef = useRef();
  const [isShowUpload, setIsShowUpload] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loadingAttach, setLoadingAttach] = useState(false);
  //

  const beforeUpload = (file) => {
    setErrMessage("");
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      setErrMessage("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setErrMessage("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <div>
      {loadingAttach ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoadingAttach(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      setAttachment(info.file);
      setLoadingAttach(false);
    }
  };

  useEffect(() => {
    if (isFocusInput) {
      inputRef.current.focus();
    }
  }, [isFocusInput]);

  return (
    <div className="commentList" style={{ display: isShow ? "block" : "none" }}>
      <p className="commentList__seeAll">Xem tất cả bình luận</p>
      <div className="commentList__postComment">
        <img
          src={
            profileReducer?.avatar
              ? getUrlImage(profileReducer?.avatar)
              : DefaultAvatar
          }
          alt="avatar"
          className="avatar"
        />
        <div className="w-100">
          <input
            type="text"
            placeholder="Viết bình luận..."
            className="commentList__inputComment"
            ref={inputRef}
          />
          <i
            class="fa fa-image commentList__iconAttach"
            onClick={() => setIsShowUpload(!isShowUpload)}
          ></i>
          {/* Upload */}
          {isShowUpload && (
            <>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http://localhost:4000/api/upload/singleFile"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {attachment ? (
                  <img
                    src={getUrlImage(attachment)}
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
              <p>{errMessage}</p>
            </>
          )}
        </div>
      </div>
      {/* Comments */}
      {[0, 1, 2, 3, 4].map((item, index) => {
        return <Comment />;
      })}
    </div>
  );
};
export default CommentList;
