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
} from "antd";
import {
  LikeOutlined,
  ShareAltOutlined,
  MoreOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import SNUpload from "./SNUpload";
import { useState } from "react";
import getAudience from "@/util/getAudience";
import { getUrlImage, getUrlVideo } from "@/util/index";
import getFirstLetter from "@/util/getFirstLetter";
import React from "react";
const { Meta } = Card;
const SNPost = ({ post, onDelete, onEdit, onCommentPost }) => {
  const [isShowComment, setIsShowComment] = useState(false);
  const { poster, comments } = post;
  const [form] = Form.useForm();
  const menu = (
    <Menu>
      <Menu.Item>
        <p onClick={() => onEdit(post)}>Chỉnh sửa bài viết</p>
      </Menu.Item>
      <Menu.Item>
        <p>Báo cáo bài viết</p>
      </Menu.Item>
      <Menu.Item danger>
        <p onClick={() => onDelete(post._id)}>Xóa bài viết</p>
      </Menu.Item>
    </Menu>
  );
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
    <div className="flex items-center justify-center pb-4">
      <div className="flex flex-col  border w-fit-content shadow-2">
        <Badge.Ribbon text={getAudience(post.audience)} placement="start">
          <Card
            className="w-[70rem] flex flex-col"
            bodyStyle={{ padding: "0", flexShrink: 1, flexGrow: 1 }}
            actions={[
              <LikeOutlined key="like" />,
              <p
                className="flex justify-center items-center gap-[0.8rem]"
                key={"viewComment"}
                onClick={showCommentBox}
              >
                <span>{comments.length}</span>
                <CommentOutlined />
              </p>,
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
                <Avatar src={getUrlImage(poster.avatar)}>
                  {getFirstLetter(poster.fullName)}
                </Avatar>
              }
              title={poster.fullName}
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
                        width={700}
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
            className="w-[70rem] flex flex-col"
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
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={getUrlImage(item.user?.avatar)}>
                        {getFirstLetter(item.user?.fullName)}
                      </Avatar>
                    }
                    title={
                      <a href="https://ant.design">{item.user?.fullName}</a>
                    }
                    description={item.content}
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </div>
    </div>
  );
};
export default SNPost;
