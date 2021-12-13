import "./style.scss";
import DefualtAvatar from "assets/images/default-avatar.jpg";
import Dialog from "compoents/Dialog";
import { useHistory } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import Post from "./Post";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Alert from "compoents/Alert";
import { getUrlImage, getUrlVideo } from "util/index";
import AddEditPost from "./AddEditPost";
import { deletePost } from "store/post/post.action";

const ListPost = ({ postList }) => {
  //Init
  const dispatch = useDispatch();
  //
  //Dialog
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [titleDialog, setTitleDialog] = useState("Đăng bài viết");
  const [btnSubmitDialog, setBtnSubmitDialog] = useState("Đăng");

  //Reducer
  const profileReducer = useSelector(
    (state) => state.userReducer.profileCurentUser
  );
  const profileOtherReducer = useSelector((state) => state.userReducer.profile);
  const notifyReducer = useSelector((state) => state.postReducer.notify);

  //Alert
  const [titleAlert, setTitleAlert] = useState("Tạo bài viết");

  //Form post
  const refAddEditPost = useRef(null);
  const [typeForm, setTypeForm] = useState("create");
  const [selectedPost, setSelectedPost] = useState(null);

  //set
  const history = useHistory();
  const handleCreate = async () => {
    await setIsShowDialog(true);

    // console.log(refAddEditPost.current);
    setTypeForm("create");
    setTitleDialog("Đăng bài viết");
    setTitleAlert("Đăng bài viết");
    setBtnSubmitDialog("Đăng");
    await refAddEditPost?.current?.setInitState();
  };
  const handleEdit = async (postId) => {
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
    await setIsShowDialog(true);

    setTypeForm("edit");
    setTitleDialog("Chỉnh sửa bài viết");
    setTitleAlert("Cập nhật bài viết");
    setBtnSubmitDialog("Cập nhật");

    await refAddEditPost.current.setValuesForm(
      audience,
      text,
      editAttach,
      postId
    );
  };

  const handleDelete = async (postId) => {
    setTypeForm("delete");
    setBtnSubmitDialog("Xóa");
    setTitleDialog("Xóa bài viết");
    setTitleAlert("Xóa bài viết");
    await setSelectedPost(postId);
    await setIsShowDialog(true);
  };

  return (
    <div className="listPost">
      {/* Notification */}
      <Alert
        response={notifyReducer}
        title={titleAlert}
        onSuccess={() => {
          if (refAddEditPost.current) {
            refAddEditPost.current.setInitState();
          }
          setIsShowDialog(false);
        }}
      />
      {/* Post status */}
      <div className="card postStatus">
        {(profileOtherReducer._id === profileReducer._id ||
          history.location.pathname == "/") && (
          <>
            {" "}
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
              <p> Chia sẻ với mọi người về suy nghĩ của bạn hiện tại nào...</p>
            </div>
          </>
        )}

        <Dialog
          isShow={isShowDialog}
          handleHideDialog={() => {
            setIsShowDialog(false);
          }}
          btnSubmitName={btnSubmitDialog}
          title={titleDialog}
          onSubmit={() => {
            typeForm !== "delete"
              ? refAddEditPost.current.handleSubmit(typeForm)
              : dispatch(deletePost(selectedPost));
            setIsShowDialog(false);
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
              onDelete={() => handleDelete(post._id)}
            />
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default ListPost;
