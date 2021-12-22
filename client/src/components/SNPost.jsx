import {
  Avatar,
  Badge,
  Card,
  Dropdown,
  Menu,
  List,
  Popover,
  Form,
  Button,
  Input,
  Carousel,
  Image,
  Comment,
  Tooltip,
} from "antd";
import {
  LikeOutlined,
  MoreOutlined,
  CommentOutlined,
  LikeFilled,
} from "@ant-design/icons";
import { createElement, useState } from "react";
import getAudience from "@/util/getAudience";
import { formatMinutes } from "@/util/index";
import { getUrlImage, getUrlVideo } from "@/util/index";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SNAvatar from "./SNAvatar";
import { formatMinutes } from "@/util/index";
const { Meta } = Card;
const SNPost = ({ post, onDelete, onEdit, onCommentPost, onLike }) => {
  const [isShowComment, setIsShowComment] = useState(false);
  const myProfile = useSelector((state) => state.profile);
  const { poster, comments, like } = post;
  const [form] = Form.useForm();
  // Comment
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);

  const likeComment = () => {
    setLikes(1);
    setDislikes(0);
    setAction("liked");
  };

  const isPoster = myProfile?._id === poster?._id ?? false;

  const menu = (
    <Menu>
      {isPoster && (
        <Menu.Item>
          <p onClick={() => onEdit(post)}>Chỉnh sửa bài viết</p>
        </Menu.Item>
      )}
      {!isPoster && (
        <Menu.Item>
          <p>Báo cáo bài viết</p>
        </Menu.Item>
      )}
      {isPoster && (
        <Menu.Item danger>
          <p onClick={() => onDelete(post._id)}>Xóa bài viết</p>
        </Menu.Item>
      )}
    </Menu>
  );

  const actionComment = [
    <Tooltip key="comment-basic-like" title="Thích">
      <div className="flex items-center gap-[0.8rem]" onClick={likeComment}>
        {createElement(action === "liked" ? LikeFilled : LikeOutlined)}
        <p className="comment-action">{likes}</p>
      </div>
    </Tooltip>,
    <span className="ml-[1rem]" key="comment-basic-reply-to">
      Trả lời
    </span>,
  ];
  const onSubmitCmt = (values) => {
    const data = {
      content: values.contentComment,
      postId: post._id,
      file: [],
    };
    onCommentPost(data);
    form.resetFields();
  };
  const showCommentBox = () => {
    setIsShowComment(!isShowComment);
  };

  const formComment = (
    <Form
      form={form}
      name="basic"
      layout={"vertical"}
      initialValues={{ remember: true }}
      onFinish={onSubmitCmt}
      autoComplete="off"
      className="p-[1.2rem]"
    >
      <Form.Item
        name="contentComment"
        rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
      >
        <Input.TextArea
          placeholder="Nội dung bình luận."
          showCount
          maxLength={50}
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      </Form.Item>

      {/* <Form.Item label="Đính kèm ảnh hoặc video" name="avatar">
        <SNUpload onUploadSuccess={(value) => setAvatar(value)} />
      </Form.Item> */}

      <div className="w-full text-right">
        <Button type="primary" htmlType="submit" className="bg-green-4">
          Đăng bình luận
        </Button>
      </div>
    </Form>
  );
  return (
    <div className="flex items-center justify-center pb-4 w-full">
      <div className="flex flex-col  border w-full shadow-2 ">
        <Badge.Ribbon text={getAudience(post.audience)} placement="start">
          <Card
            className="w-full flex flex-col"
            bodyStyle={{ padding: "0", flexShrink: 1, flexGrow: 1 }}
            actions={[
              <div
                className="flex justify-center items-center gap-[0.8rem]"
                key={"like"}
                onClick={() => onLike(post._id)}
              >
                <span className="text-md leading-[2rem] h-[1.8rem]">
                  {like.length}
                </span>
                {like.findIndex((item) => item.user._id === myProfile._id) !==
                -1 ? (
                  <LikeFilled className="text-green-3 text-md" />
                ) : (
                  <LikeOutlined className="text-md" />
                )}
              </div>,
              <div
                className="flex justify-center items-center gap-[0.8rem]"
                key={"viewComment"}
                onClick={showCommentBox}
              >
                <span className="text-md leading-[2rem] h-[1.8rem]">
                  {comments.length}
                </span>
                <CommentOutlined className="text-md" />
              </div>,
            ]}
            bordered={false}
            extra={
              <Dropdown overlay={menu} placement="bottomRight">
                <MoreOutlined />
              </Dropdown>
            }
          >
            <Meta
              style={{ padding: "1.6rem" }}
              avatar={
                <SNAvatar src={poster.avatar} fullName={poster.fullName} />
              }
              title={
                <>
                  {" "}
                  <Link to={`/profile/${poster._id}`}>
                    {poster.fullName}
                  </Link>{" "}
                  <div className="text-[12px] text-gray-400">
                    {formatMinutes(post.createAt)}
                  </div>
                </>
              }
              description={post.text}
            />
            {/* Attachment */}
            {post.attachments.length > 0 && (
              <Carousel>
                {post.attachments.map((item, index) => {
                  if (item.type === "video/mp4") {
                    return (
                      <video controls key={index}>
                        <source src={getUrlVideo(item.file)} />
                      </video>
                    );
                  }
                  return (
                    <div key={index}>
                      <Image
                        className="w-full"
                        src={getUrlImage(item.file)}
                        fallback="data:image/png;base64,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"
                      />
                    </div>
                  );
                })}
              </Carousel>
            )}
          </Card>
        </Badge.Ribbon>
        {/* Card Bình luận */}
        {isShowComment && (
          <Card
            title={`Bình luận ${
              comments.length > 0 ? `- ${comments.length} lượt bình luận` : ""
            }`}
            className="w-full flex flex-col"
            bodyStyle={{
              padding: "1.6rem",
              overflow: "auto",
              flexGrow: 1,
              flexShrink: 1,
            }}
            actions={[formComment]}
          >
            <List
              itemLayout="horizontal"
              dataSource={comments}
              locale={{ emptyText: "Chưa có bình luận nào." }}
              renderItem={(item) => (
                <li>
                  <Comment
                    actions={actionComment}
                    author={item.user?.fullName}
                    avatar={
                      <SNAvatar
                        src={item.user?.avatar}
                        fullName={item.user?.fullName}
                      />
                    }
                    content={item.content}
                    datetime={formatMinutes(item.createAt)}
                  >
                    {/* Chổ này xử lý comment con */}
                    {/* <Comment
                      actions={actionComment}
                      author={item.user?.fullName}
                      avatar={
                        <SNAvatar
                          src={item.user?.avatar}
                          fullName={item.user?.fullName}
                        />
                      }
                      content={item.content}
                      datetime={formatMinutes(item.createAt)}
                    ></Comment> */}
                  </Comment>
                </li>
              )}
            />
          </Card>
        )}
      </div>
    </div>
  );
};
export default SNPost;
