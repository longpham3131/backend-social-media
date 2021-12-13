import DefaultAvatar from "assets/images/default-avatar.jpg";
import { useSelector, useDispatch } from "react-redux";
import { getUrlImage } from "util/index";
import Comment from "./Comment";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import "./style.scss";
import { useEffect, useRef, useState } from "react";
import { Upload } from "antd";
import { postComment, editComment } from "store/post/post.action";
import { beforeUpload } from "util/index";
import autosize from "autosize";
const CommentList = ({ post, isShow, isFocusInput, comments }) => {
  //GENERATE
  const profileReducer = useSelector(
    (state) => state.userReducer.profileCurentUser
  );
  const inputRef = useRef();
  const [isShowUpload, setIsShowUpload] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loadingAttach, setLoadingAttach] = useState(false);
  const [comment, setComment] = useState("");
  //
  const dispatch = useDispatch();
  const beforeUploadFile = (file) => {
    beforeUpload(file);
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
      console.log(info.file);
      setLoadingAttach(false);
    }
  };
  const handleSendComment = (event) => {
    if (event.keyCode == 13 && event.shiftKey) {
      return;
    } else if (event.key === "Enter") {
      let file = [];
      if (attachment?.length > 0) {
        file = attachment.map((item) => ({
          file: item.response.data.filePath,
          type: item.response.data.fileType,
          name: item.response.data.fileName,
          size: item.response.data.fileSize,
        }));
      }

      console.log({
        content: event.target.value,
        postId: post._id,
        file,
      });
      dispatch(
        postComment({
          content: event.target.value,
          postId: post._id,
          file,
        })
      );
      setComment("");
      setAttachment(null);
      setIsShowUpload(false);
      autosize(inputRef.current);
    }
  };
  const handleChangeComment = (event) => {
    if (event.key === "Enter") console.log("sss");
    setComment(event.target.value);
  };
  useEffect(() => {
    if (isFocusInput) {
      inputRef.current.focus();
    }
  }, [isFocusInput]);
  useEffect(() => {
    autosize(inputRef.current);
  }, [comment]);
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
            ref={(e) => (inputRef.current = e)}
            value={comment}
            onChange={(e) => {
              handleChangeComment(e);
              // autosize(inputRef.current);
            }}
            onKeyDown={handleSendComment}
          />
          <i
            class="fa fa-image commentList__iconAttach"
            onClick={() => setIsShowUpload(!isShowUpload)}
          ></i>
          {/* Upload */}
          {isShowUpload && (
            <>
              <Upload
                onPreview={onPreview}
                listType="picture-card"
                className="avatar-uploader"
                fileList={attachment}
                action="https://uploadfile0510.herokuapp.com/api/upload/singleFile"
                // beforeUpload={beforeUploadFile}
                onChange={({ fileList: newFileList }) => {
                  setAttachment(newFileList);
                }}
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
      {comments?.map((item, index) => {
        return (
          <Comment
            key={index}
            profile={profileReducer}
            comment={item}
            postId={post._id}
          />
        );
      })}
    </div>
  );
};
export default CommentList;
