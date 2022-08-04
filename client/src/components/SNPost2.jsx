import React, { useEffect, useRef, useState } from "react";
import SNAvatar from "./SNAvatar";
import { formatMinutes } from "@/util/index";
import { Link, useParams } from "react-router-dom";
import { Dropdown, Form, Input, Menu, message, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  LikeOutlined,
  MoreOutlined,
  CommentOutlined,
  LikeFilled,
  DeploymentUnitOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import CreateEditPost from "./SNCreateEditPost";
import postAPI from "@/apis/postAPI";
import {
  createComment,
  deletePost,
  editPost,
  likePost,
} from "@/store/postSlice";
import htmlToDraft from "html-to-draftjs";
import { ContentState, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import SNImage from "./SNImage";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import SNTextField from "./SNTextField";
import SNWidgetBoxItem from "./SNWidgetBoxItem";
import SNComment from "./SNComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
import SNCreateEditPost from "./SNCreateEditPost";
import SNPostAttachments from "./SNPostAttachments";
const { confirm } = Modal;
const SNPost2 = ({ post, isPostDetail = false, onSuccessAct }) => {
  const {
    attachments,
    comments,
    isGroup,
    like,
    postParent,
    poster,
    share,
    status,
    text,
    title,
    _id,
    createAt,
    username,

    audience,
    groupId,
  } = post;
  const { avatar, fullName } = poster;
  const myProfile = useSelector((state) => state.profile);
  const isPoster = myProfile?._id === poster?._id ?? false;
  const hasMedia = attachments.length ? true : false;
  const liked =
    like.findIndex((item) => item.user._id === myProfile?._id) !== -1;
  const dispatch = useDispatch();
  const [showEditPost, setShowEditPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const refAddEditPost = useRef(null);
  const handleDeletePost = async (postId) => {
    confirm({
      title: "Are you sure you want to delete this post?",
      icon: <ExclamationCircleOutlined />,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk() {
        try {
          postAPI.deletePost(postId);
          isPostDetail ? onSuccessAct() : dispatch(deletePost(postId));
          message.success("Success!");
        } catch {
          message.error("Failed!");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const showEdit = async (post) => {
    await refAddEditPost.current.setFields(
      post.audience,
      post.text,
      post.attachments
    );
    setShowEditPost(true);
    setSelectedPostId(post._id);
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await postAPI.likePost(postId);
      isPostDetail ? onSuccessAct() : dispatch(likePost(res.data));
    } catch {
      message.error("Failed");
    }
  };
  const handleEditPost = async (values) => {
    values.postId = selectedPostId;
    console.log("success", values);
    try {
      const res = await postAPI.editPost(values);
      isPostDetail ? onSuccessAct() : dispatch(editPost(res.data));
      message.success("Success!");
      refAddEditPost.current.resetFields();
      setShowEditPost(false);
    } catch {
      message.error("Edit post failed");
    }
  };

  const menu = (
    <Menu>
      {isPoster && (
        <Menu.Item key={"edit"}>
          <p onClick={() => showEdit(post)}>Edit post</p>
        </Menu.Item>
      )}
      {!isPoster && (
        <Menu.Item key={"report"}>
          <p>Report</p>
        </Menu.Item>
      )}
      {isPoster && (
        <Menu.Item danger key={"delete"}>
          <p onClick={() => handleDeletePost(post._id)}>Delete post</p>
        </Menu.Item>
      )}
    </Menu>
  );

  const handleAudience = (audience) => {
    switch (audience) {
      case "public":
        return (
          <FontAwesomeIcon
            icon={faEarthAmericas}
            className=" text-[14px] text-color-text"
          />
        );
      case "friends":
        return (
          <TeamOutlined
            style={{ fontSize: "14px", color: "var(text-color-text)" }}
          />
        );
      case "private":
        return (
          <FontAwesomeIcon
            icon={faLock}
            className=" text-[14px] text-color-text"
          />
        );
      default:
        return (
          <DeploymentUnitOutlined
            style={{ fontSize: "14px", color: "var(text-color-text)" }}
          />
        );
    }
  };
  return (
    <>
      <div className="sn-post">
        {/* Header */}
        <div className="sn-post-header">
          <div className="sn-post-header-user">
            <SNAvatar src={avatar} size={45} />
            <div className="flex flex-col gap-[5px]">
              <p className="sn-post-header-user-info">
                <Link to={`/profile/${poster._id}`}>{fullName}</Link>
                <span className="sn-post-header-user-des">
                  {" "}
                  posted an update{" "}
                  {isGroup && groupId && (
                    <span>
                      in the group{" "}
                      <Link className="font-bold" to={`/groups/${groupId._id}`}>
                        {groupId.groupName}
                      </Link>
                    </span>
                  )}
                </span>
              </p>
              <p className="sn-post-header-user-create-post flex items-center gap-[5px]">
                {handleAudience(audience)}{" "}
                <span>{formatMinutes(createAt)}</span>
              </p>
            </div>
          </div>
          {/* Dropdown left */}
          {isPoster ? (
            <Dropdown overlay={menu} placement="bottomRight">
              <MoreOutlined />
            </Dropdown>
          ) : (
            <></>
          )}
        </div>
        {/* Content */}
        <div className="sn-post-content">
          <div className="px-[28px] pt-[28px]">
            <p className="sn-post-content-text">{text}</p>
          </div>
          {/* Image or Video */}
          {hasMedia && !isPostDetail ? (
            // <SNImage urlImage={attachments[0]?.filePath} hasRounded={false} />
            <SNPostAttachments attachments={attachments} />
          ) : (
            <></>
          )}
        </div>
        {/* Reaction */}
        <div className="pl-[28px] ">
          <div
            className={classNames("sn-post-react", {
              "border-color-divider border-t-[1px]": attachments.length < 1,
            })}
          >
            <div className="flex gap-[12px]">
              <p className="sn-post-react-count">{like.length} Likes </p>
              <p className="sn-post-react-count">{comments.length} Comments</p>
            </div>
            <div
              className={classNames("sn-post-react-like", {
                liked: liked,
              })}
              onClick={() => handleLikePost(_id)}
            >
              <p>{liked ? "I Liked" : "Like"}</p>
            </div>
          </div>
        </div>
        {/* Comment */}
        <SNComment
          postId={_id}
          comments={comments}
          isPostDetail={isPostDetail}
          onSuccessAct={onSuccessAct}
        />
      </div>

      <SNCreateEditPost
        ref={refAddEditPost}
        visible={showEditPost}
        title="Edit post"
        okText="Update"
        onClose={() => setShowEditPost(false)}
        onSubmit={handleEditPost}
      />
    </>
  );
};

export default SNPost2;
