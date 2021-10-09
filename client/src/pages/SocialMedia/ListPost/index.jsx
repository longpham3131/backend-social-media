import "./style.scss";
import DefualtAvatar from "assets/images/default-avatar.jpg";
import Dialog from "compoents/Dialog";
import { useEffect, useRef, useState } from "react";

import Post from "./Post";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
<<<<<<< HEAD

=======
import { createPost, deletePost, editPost } from "store/post/post.action";
>>>>>>> d42ff2d8a2592d47a437baa32f2485a44576b8a4
import Notifications from "compoents/Notifications";
import { getUrlImage, getUrlVideo } from "util/index";
import AddEditPost from "./AddEditPost";

const ListPost = ({ postList }) => {
  //Dialog
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [titleDialog, setTitleDialog] = useState("Đăng bài viết");
  const [btnSubmitDialog, setBtnSubmitDialog] = useState("Đăng");

  //Reducer
  const profileReducer = useSelector((state) => state.userReducer.profile);
  const notifyReducer = useSelector((state) => state.postReducer.notify);

  //Notifications
  const [titleNotify, setTitleNotify] = useState("Tạo bài viết");
<<<<<<< HEAD
=======
  const setInitState = () => {
    formCreateEditPost.resetFields();
    setAttachments([]);
    setAudience("public");
    setText("");
    setIsShowDialog(false);
  };
  const handleSubmit = () => {
    switch (typeForm) {
      case "create": {
        console.log("CREATE");
        let newAttachments = attachments.map((item) => ({
          file: item.response.data.filePath,
          type: item.response.data.fileType,
          name:item.response.data.fileName,
          size:item.response.data.fileSize
        }));
        const post = {
          text,
          audience,
          attachments: newAttachments,
          postParent: "",
        };
        // await console.log("create", post);
        dispatch(createPost(post));
        break;
      }
      case "edit": {
        console.log("EDIT", attachments);
        let newAttachments = attachments.map((item) => ({
          file: item.file ? item.file : item.response.data.filePath,
          type: item.type ? item.type : item.response.data.fileType,
        }));
        const post = {
          postId: selectedPost,
          text,
          audience,
          attachments: newAttachments,
          postParent: "",
        };
        // await console.log("create", post);
        dispatch(editPost(post));
        break;
      }
      default: {
        dispatch(deletePost(selectedPost));
        break;
      }
    }
  };
>>>>>>> d42ff2d8a2592d47a437baa32f2485a44576b8a4

  //Form post
  const refAddEditPost = useRef(null);
  const [typeForm, setTypeForm] = useState("create");

  //set
  const handleCreate = () => {
    refAddEditPost?.current?.setInitState();
    // console.log(refAddEditPost.current);
    setTypeForm("create");
    setTitleDialog("Đăng bài viết");
    setTitleNotify("Đăng bài viết");
    setBtnSubmitDialog("Đăng");
    setIsShowDialog(true);
  };

  const handleEdit = (postId) => {
    const { audience, text, attachments } = postList.filter(
      (item) => item._id === postId
    )[0];

    let editAttach = [];
    attachments.map((item, index) => {
      editAttach.push({
        uid: index,
        name: item.file,
        status: "done",
        url:
          item.type === "video/mp4"
            ? getUrlVideo(item.file)
            : getUrlImage(item.file),
        file: item.file,
        type: item.type,
      });
    });

    refAddEditPost.current.setValuesForm(audience, text, editAttach, postId);

    setTypeForm("edit");
    setTitleDialog("Chỉnh sửa bài viết");
    setTitleNotify("Cập nhật bài viết");
    setBtnSubmitDialog("Cập nhật");
    setIsShowDialog(true);
  };

  const handleDelete = (postId) => {
    setTypeForm("delete");
    setBtnSubmitDialog("Xóa");
    setTitleNotify("Xóa bài viết");
    refAddEditPost.current.setSelectedPost(postId);
    setIsShowDialog(true);
  };

  return (
    <div className="listPost">
      {/* Notification */}
      <Notifications
        response={notifyReducer}
        title={titleNotify}
        onSuccess={() => {
          refAddEditPost.current.setInitState();
          setIsShowDialog(false);
        }}
      />
      {/* Post status */}
      <div className="card postStatus">
        <img
          src={
            profileReducer?.avatar
              ? getUrlImage(profileReducer?.avatar)
              : DefualtAvatar
          }
          alt="avatar"
          className="avatar"
        />
        <div className="postStatus__placehoder" onClick={handleCreate}>
          <p> Chia sẽ với mọi người về suy nghĩ của bạn hiện tại nào...</p>
        </div>
        <Dialog
          isShow={isShowDialog}
          handleHideDialog={() => {
            setIsShowDialog(false);
          }}
          btnSubmitName={btnSubmitDialog}
          title={titleDialog}
          onSubmit={() => {
            refAddEditPost.current.handleSubmit(typeForm);
          }}
          content={
            typeForm !== "delete" ? (
<<<<<<< HEAD
              <AddEditPost
                ref={refAddEditPost}
                avatar={profileReducer?.avatar}
                fullName={profileReducer?.fullName}
              />
=======
              <Form form={formCreateEditPost} onFinish={handleSubmit}>
                <div className="postStatus__content">
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        profileReducer?.avatar
                          ? getUrlImage(profileReducer?.avatar)
                          : DefualtAvatar
                      }
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
                    <Form.Item
                      label={"Nội dung"}
                      name="Text"
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
                        value={"sadsdasd"}
                        onChange={(e) => {
                          setText(e.target.value);
                          console.log("object", e.target.value);
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      label={"Hình ảnh"}
                      name="Attachments"
                      labelCol={{ span: 24 }}
                    >
                      <Upload
                        action="http://localhost:4000/api/upload/singleFile"
                        listType="picture-card"
                        fileList={attachments}
                        onChange={onChangeAttach}
                        onPreview={onPreview}
                      >
                        {attachments.length < 5 && "+ Upload"}
                      </Upload>
                    </Form.Item>
                  </div>
                  <p className="options">Tùy chọn thêm</p>
                  <div className="d-flex align-items-center justify-content-start">
                    <i className="fa fa-image"></i>
                    <i className="fa fa-tag"></i>
                  </div>
                </div>
              </Form>
>>>>>>> d42ff2d8a2592d47a437baa32f2485a44576b8a4
            ) : (
              <p>Bạn có muốn xóa bài viết này ?</p>
            )
          }
        />
      </div>

      {/* Render Post List */}
      {postList?.length > 0 ? (
        postList &&
        postList.map((post, index) => {
          return (
            <Post
              post={post}
              key={`post_${index + post.createAt}`}
              onEdit={() => handleEdit(post._id)}
              onDelete={() => {
                handleDelete(post._id);
              }}
            />
          );
        })
      ) : (
        <>
          <Post />
          <Post />
          <Post />
          <Post />
        </>
      )}
    </div>
  );
};

export default ListPost;
