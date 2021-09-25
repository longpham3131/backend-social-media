import "./style.scss";
import DefualtAvatar from "assets/images/default-avatar.jpg";
import Dialog from "compoents/Dialog";
import { useEffect, useState } from "react";
import { Select, Form } from "antd";
import { Input, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import Post from "./Post";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createPost, deletePost } from "store/actions/post.action";
import Notifications from "compoents/Notifications";
import { uploadFile } from "store/actions/upload.action";

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

  const handleUpload = (attachments) => {
    dispatch(uploadFile(attachments[0].originFileObj));
  };
  const uploadImage = async (base64EncodedImage) => {
    try {
      console.log(base64EncodedImage)
    } catch (err) {
        console.error('AHHHHHHHH',err);
    }
};
  const handleSubmit = async () => {
    switch (typeForm) {
      case "create":
        const reader = new FileReader();
        reader.readAsDataURL(attachments[0]);
        reader.onloadend = () => {
          uploadImage(reader.result);
        };
        reader.onerror = () => {
          console.error('AHHHHHHHH!!');
        };



        let newAttachments = [];
        // if (attachments.length > 0) {
        //   newAttachments = await handleUpload(attachments);
        // }
        const post = await {
          text,
          audience,
          poster: {
            userId: profileReducer._id,
            fullName: profileReducer.fullName,
            avatar: profileReducer.avatar,
            username: profileReducer.username,
          },
          attachments: newAttachments,
        };
        await console.log("create", post);
        await dispatch(createPost(post));
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

  const onChangeAttach = ({ fileList: newFileList }) => {
    setAttachments(newFileList);
  };

  useEffect(() => {
    console.log(attachments);
  }, [attachments]);

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
                      label={"Nội dung"}
                      name="text"
                      labelCol={{ span: 24 }}
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
                    <Form.Item
                      label={"Hình ảnh"}
                      name="attachments"
                      labelCol={{ span: 24 }}
                    >
                      <ImgCrop rotate>
                        <Upload
                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          listType="picture-card"
                          fileList={attachments}
                          onChange={onChangeAttach}
                          onPreview={onPreview}
                        >
                          {attachments.length < 5 && "+ Upload"}
                        </Upload>
                      </ImgCrop>
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
