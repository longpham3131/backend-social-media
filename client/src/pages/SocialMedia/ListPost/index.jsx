import "./style.scss";
import DefualtAvatar from "assets/images/default-avatar.jpg";
import Dialog from "compoents/Dialog";
import { useState } from "react";
import { Select } from "antd";
import { Input } from "antd";
import Post from "./Post";

const { TextArea } = Input;

const { Option } = Select;
const ListPost = ({ postList }) => {
  const [isShowDialog, setIsShowDialog] = useState(false);

  const handleChange = (value) => {
    console.log("VALUE SELCT", value);
  };
  return (
    <div className="listPost">
      {/* Post status */}
      <div className="card postStatus">
        <img src={DefualtAvatar} alt="avatar" className="avatar" />
        <div
          className="postStatus__placehoder"
          onClick={() => setIsShowDialog(true)}
        >
          <p> Chia sẽ với mọi người về suy nghĩ của bạn hiện tại nào...</p>
        </div>
        <Dialog
          isShow={isShowDialog}
          handleHideDialog={() => {
            setIsShowDialog(false);
          }}
          btnSubmitName={"Đăng"}
          title={"Đăng bài viết"}
          content={
            <div className="postStatus__content">
              <div className="d-flex align-items-center">
                <img
                  src={DefualtAvatar}
                  alt="avatar"
                  className="avatar"
                  style={{ paddingRight: "0" }}
                />
                <div>
                  <p className="m-0">Phạm Hoàng Long</p>
                  <Select
                    defaultValue="public"
                    style={{ width: 120 }}
                    onChange={handleChange}
                  >
                    <Option value="public">Công khai</Option>
                    <Option value="friends">Bạn bè</Option>
                    <Option value="private">Chỉ mình tôi</Option>
                  </Select>
                </div>
              </div>
              <div className="pt-2">
                <TextArea
                  autoSize={{ minRows: 3 }}
                  placeholder="Bạn đang nghĩ gì thế"
                />
              </div>
              <p className="options">Tùy chọn thêm</p>
              <div className="d-flex align-items-center justify-content-start">
                <i className="fa fa-image"></i>
                <i className="fa fa-tag"></i>
              </div>
            </div>
          }
        />
      </div>

      {/* Render Post List */}
      {postList ? (
        postList.map((post) => {
          return (
            <Post
              userId={post.poster.userId}
              username={post.poster.userName}
              avatar={post.poster.userName}
              audience={post.audience}
              text={post.text}
              createAt={post.createAt}
            />
          );
        })
      ) : (
        <div>
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
      )}
    </div>
  );
};

export default ListPost;
