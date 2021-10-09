import "./style.scss";
import DefualtAvatar from "assets/images/default-avatar.jpg";
import Dialog from "compoents/Dialog";
import { useEffect, useRef, useState } from "react";

import Post from "./Post";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
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
              <AddEditPost
                ref={refAddEditPost}
                avatar={profileReducer?.avatar}
                fullName={profileReducer?.fullName}
              />
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
