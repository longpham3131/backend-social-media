import "./style.scss";
import DefaultAvatar from "assets/images/default-avatar.jpg";
import DefaultImage from "assets/images/default-image.jpg";
import moment from "moment";
import "moment/locale/vi"; // without this line it didn't work
import { Menu, Dropdown, Carousel } from "antd";
import {
  EllipsisOutlined,
  CloseCircleOutlined,
  FormOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getUrlImage, getUrlVideo } from "util/index";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likePost } from "store/post/post.action";
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  LikeFilled,
} from "@ant-design/icons";
import { useState } from "react";
import CommentList from "./CommentList";
import { formatMinutes } from "util/index";
moment.locale("vi");

const Post = ({ post, onEdit, onDelete, type = "default" }) => {
  //State
  const [isShowPreviewLike, setIsShowPreviewLike] = useState(false);
  const [isShowCommentList, setIsShowCommentList] = useState(false);
  const [isFocusInput, setIsFocusInput] = useState(false);
  //
  const dispatch = useDispatch();
  let history = useHistory();
  // GET DATA FROM REDUCER
  const profileReducer = useSelector((state) => state.userReducer.profile);
  const profileCurentReducer = useSelector(
    (state) => state.userReducer.profileCurentUser
  );
  //
  const handleSettings = ({ key }) => {
    switch (key) {
      case "1":
        break;
      case "2":
        onEdit();
        break;
      case "3":
        onDelete();
        break;
      default:
        break;
    }
  };
  const handleLike = () => {
    dispatch(likePost(post._id));
  };
  const menu = (
    <Menu onClick={handleSettings}>
      <Menu.Item key={1} icon={<ExclamationCircleOutlined />}>
        Báo cáo
      </Menu.Item>
      <Menu.Item key={2} icon={<FormOutlined />}>
        Chỉnh sửa bài viết
      </Menu.Item>
      <Menu.Item key={3} icon={<CloseCircleOutlined />}>
        Xóa bài viết
      </Menu.Item>
     
    </Menu>
  );

  return (
    <div className="post card">
      <div className="post__owner">
        <img
          src={
            post?.poster.avatar != ""
              ? getUrlImage(post?.poster.avatar)
              : DefaultAvatar
          }
          alt=""
          className={post?.poster.avatar != "" ? "avatar" : "avatar skeleton"}
        />
        <div className="w-100">
          <p
            className={
              post?.poster.username ? "post__userName" : "post__userName "
            }
            onClick={() => {
              history.push(`/profile/${post?.poster._id}`);
            }}
          >
            {post?.poster.fullName}
          </p>
          <p
            className={
              post?.audience ? "post__permission" : "post__permission  "
            }
          >
            {post?.audience}{" "}
            {post?.createAt ? " - " + formatMinutes(post?.createAt) : ""}
          </p>
        </div>
        {profileCurentReducer._id === post.poster._id && (
          <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
            <p className="post__settings">
              <EllipsisOutlined />
            </p>
          </Dropdown>
        )}
      </div>
      {/*Post content include text and attachments */}
      {post?.text ? (
        <p className="post__text">{post?.text}</p>
      ) : (
        <div className="w-100 py-3">
          <p className="skeleton skeleton-text"></p>
          <p className="skeleton skeleton-text"></p>
          <p className="skeleton skeleton-text"></p>
          <p className="skeleton skeleton-text"></p>
        </div>
      )}
      {type !== "dialog" && (
        <div
          className="post__attachments"
          style={{ display: post?.attachments?.length > 0 ? "block" : "none" }}
        >
          <Carousel dotPosition={"bottom"}>
            {post?.attachments?.length > 0 &&
              post?.attachments.map((item, index) => {
                if (item.type === "video/mp4") {
                  return (
                    <video controls key={index}>
                      <source src={getUrlVideo(item.file)} />
                    </video>
                  );
                }
                return (
                  <div key={index}>
                    <img src={getUrlImage(item.file)} alt="attachments" />
                  </div>
                );
              })}
          </Carousel>
        </div>
      )}

      {/* Số like, bình luận, chia sẽ */}
      <div className="post__countReact">
        <p>
          {post?.like.length} lượt thích
          <div className="post__previewReact">
            {post?.like.map((item, index) => {
              return (
                <span key={index} className="d-block">
                  {item.user.fullName}
                </span>
              );
            })}
          </div>
        </p>
        <p
          onClick={() => {
            setIsShowCommentList(!isShowCommentList);
            setIsFocusInput(false);
          }}
        >
          {post?.comments.length} bình luận
        </p>
        <p>0 lượt chia sẻ</p>
      </div>
      <div
        className="post__react"
        style={{
          display: "flex",
          // display: post && Object.keys(post._id).length !== 0 ? "flex" : "flex",
          borderBottom: isShowCommentList ? "1px solid black" : "",
        }}
      >
        <button className="btn w-100" onClick={() => handleLike()}>
          {post?.like.some((item) => item?.user?._id == profileCurentReducer._id) ? (
            <>
              <LikeFilled style={{ color: "#2078f4" }} />
              <span style={{ color: "#2078f4" }}>Thích</span>
            </>
          ) : (
            <>
              <LikeOutlined />
              <span>Thích</span>
            </>
          )}
        </button>
        <button
          className="btn w-100"
          onClick={() => {
            setIsShowCommentList(true);
            setIsFocusInput(true);
          }}
        >
          <CommentOutlined />
          <span>Bình luận</span>
        </button>
        <button className="btn w-100">
          <ShareAltOutlined />
          <span>Chia sẻ</span>
        </button>
      </div>
      {/* Comment list */}
      <CommentList
        isShow={isShowCommentList}
        post={post}
        isFocusInput={isFocusInput}
        comments={post?.comments ?? []}
      />
    </div>
  );
};
export default Post;
