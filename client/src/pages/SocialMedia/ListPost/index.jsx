import "./style.scss";
import DefualtAvatar from "assets/images/default-avatar.jpg";
import Dialog from "compoents/Dialog";
import { useEffect, useState } from "react";
import { Select, Form } from "antd";
import { Input } from "antd";
import Post from "./Post";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createPost, deletePost } from "store/actions/post.action";
import Notifications from "compoents/Notifications";

const { TextArea } = Input;

const { Option } = Select;
const ListPost = ({ postList }) => {
  const dispatch = useDispatch();

  //Dialog
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [contentDialog, setContentDialog] = useState(null);
  const [titleDialog, setTitleDialog] = useState("Đăng bài viết");
  const [btnSubmitDialog, setBtnSubmitDialog] = useState("Đăng");

  //Reducer
  const profileReducer = useSelector((state) => state.userReducer.profile.data);
  const createPostReducer = useSelector(
    (state) => state.postReducer.createPost
  );
  const editPostReducer = useSelector((state) => state.postReducer.editPost);
  const deletePostReducer = useSelector(
    (state) => state.postReducer.deletePost
  );

  //Form post
  const [formCreateEditPost] = Form.useForm();
  const [typeForm, setTypeForm] = useState("create");
  const [audience, setAudience] = useState("public");
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  //Notifications
  const [titleNotify, setTitleNotify] = useState("Tạo bài viết");

  const handleSubmit = () => {
    switch (typeForm) {
      case "create":
        const post = {
          text,
          audience,
          poster: {
            userId: profileReducer._id,
            fullName: profileReducer.fullName,
            avatar: profileReducer.avatar,
            username: profileReducer.username,
          },
          attachments,
        };
        console.log("create", post);
        dispatch(createPost(post));
        break;
      case "edit":
        console.log("EDIT");
        break;
      default:
        dispatch(deletePost(selectedPost));
        break;
    }
  };

  const handleCreate = () => {
    setTypeForm("create");
    setTitleDialog("Đăng bài viết");
    setTitleNotify("Đăng bài viết");
    setBtnSubmitDialog("Đăng");
    setIsShowDialog(true);
  };

  const handleEdit = () => {
    setTypeForm("edit");
    setTitleNotify("Cập nhật bài viết");
  };

  const handleDelete = (postId) => {
    setTypeForm("delete");
    setBtnSubmitDialog("Xóa");
    setTitleNotify("Xóa bài viết");
    setSelectedPost(postId);
    setIsShowDialog(true);
  };

  return (
    <div className="listPost">
      {/* Notification */}
      <Notifications
        response={
          typeForm === "delete"
            ? deletePostReducer
            : typeForm === "create"
            ? createPostReducer
            : deletePostReducer
        }
        title={titleNotify}
        onSuccess={() => {
          console.log("SUCCC");
          formCreateEditPost.resetFields();
          setAudience("public");
          setIsShowDialog(false);
        }}
      />
      {/* Post status */}
      <div className="card postStatus">
        <img src={DefualtAvatar} alt="avatar" className="avatar" />
        <div className="postStatus__placehoder" onClick={handleCreate}>
          <p> Chia sẽ với mọi người về suy nghĩ của bạn hiện tại nào...</p>
        </div>
        <Dialog
          isShow={isShowDialog}
          handleHideDialog={() => {
            setIsShowDialog(false);
          }}
          btnSubmitName={btnSubmitDialog}
          form={typeForm !== "delete" ? formCreateEditPost : null}
          title={titleDialog}
          onSubmit={handleSubmit}
          content={
            typeForm !== "delete" ? (
              <div className="postStatus__content">
                <div className="d-flex align-items-center">
                  <img
                    src={DefualtAvatar}
                    alt="avatar"
                    className="avatar"
                    style={{ paddingRight: "0" }}
                  />
                  <div>
                    <p className="m-0">{profileReducer?.fullName}</p>
                    <Select
                      defaultValue="public"
                      style={{ width: 120 }}
                      onChange={(value) => {
                        setAudience(value);
                      }}
                      value={audience}
                    >
                      <Option value="public">Công khai</Option>
                      <Option value="friends">Bạn bè</Option>
                      <Option value="private">Chỉ mình tôi</Option>
                    </Select>
                  </div>
                </div>
                <div className="pt-2">
                  <Form form={formCreateEditPost} onFinish={handleSubmit}>
                    <Form.Item
                      name="text"
                      rules={[
                        {
                          required: true,
                          message: "Nội dung không được trống",
                        },
                      ]}
                    >
                      <TextArea
                        autoSize={{ minRows: 3 }}
                        placeholder="Bạn đang nghĩ gì thế"
                        value={text}
                        onChange={(e) => {
                          setText(e.target.value);
                        }}
                      />
                    </Form.Item>
                  </Form>
                </div>
                <p className="options">Tùy chọn thêm</p>
                <div className="d-flex align-items-center justify-content-start">
                  <i className="fa fa-image"></i>
                  <i className="fa fa-tag"></i>
                </div>
              </div>
            ) : (
              <p>Bạn có muốn xóa bài viết này</p>
            )
          }
        />
      </div>

      {/* Render Post List */}
      {postList ? (
        postList.map((post, index) => {
          return (
            <Post
              userId={post.poster.userId}
              username={post.poster.username}
              fullName={post.poster.fullName}
              avatar={post.poster.avatar}
              audience={post.audience}
              text={post.text}
              createAt={post.createAt}
              key={`post_${index + post.createAt}`}
              onEdit={handleEdit}
              onDelete={() => {
                handleDelete(post._id);
              }}
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
