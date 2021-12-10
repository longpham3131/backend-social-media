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
import { getUrlImage } from "@/util/index";
import getFirstLetter from "@/util/getFirstLetter";
import React from 'react';
const { Meta } = Card;
const SNPost = ({ post }) => {
  const [avatar, setAvatar] = useState("");
  const { poster, comments } = post;
  const menu = (
    <Menu>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          Chỉnh sửa bài viết
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          Báo cáo bài viết
        </a>
      </Menu.Item>
      <Menu.Item danger>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          Xóa bài viết
        </a>
      </Menu.Item>
    </Menu>
  );
  const onSubmitCmt = (values) => {
    console.log("value commet", values);
  };
  const content = (
    <Form
      name="basic"
      layout={"vertical"}
      initialValues={{ remember: true }}
      onFinish={onSubmitCmt}
      autoComplete="off"
    >
      <Form.Item
        label="Nội dung:"
        name="contentComment"
        rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item label="Đính kèm ảnh hoặc video" name="avatar">
        <SNUpload onUploadSuccess={(value) => setAvatar(value)} />
      </Form.Item>

      <div className="w-full text-right">
        <Button type="primary" htmlType="submit" className="bg-green-4">
          Đăng bình luận
        </Button>
      </div>
    </Form>
  );
  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-start justify-center mt-[1.6rem] border w-fit-content">
        <Badge.Ribbon text={getAudience(post.audience)} placement="start">
          <Card
            style={{ width: 600 }}
            className="border-r"
            bodyStyle={{ padding: "1.6rem" }}
            actions={[
              <LikeOutlined key="like" />,
              <ShareAltOutlined key="share" />,
            ]}
            bordered={false}
            extra={
              <Dropdown overlay={menu} placement="bottomRight">
                <MoreOutlined />
              </Dropdown>
            }
          >
            <Meta
              style={{ height: 300, marginTop: "25px" }}
              avatar={
                <Avatar src={getUrlImage(poster.avatar)}>
                  {getFirstLetter(poster.fullName)}
                </Avatar>
              }
              title={poster.fullName}
              description={post.text}
            />
          </Card>
        </Badge.Ribbon>
        {/* Card Bình luận */}
        <Card
          title={`Bình luận ${
            comments.length > 0 ? `- ${comments.length} lượt bình luận` : ""
          }`}
          style={{ width: 450 }}
          bodyStyle={{
            padding: "1.6rem",
            overflow: "auto",
            maxHeight: "35rem",
            minHeight: "35rem",
          }}
          bordered={false}
          actions={[
            <Popover
              placement="top"
              title={"Bình luận"}
              content={content}
              trigger="click"
              overlayInnerStyle={{ width: 450 }}
            >
              <CommentOutlined key="comment" />
            </Popover>,
          ]}
        >
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src={getUrlImage(item.user?.avatar)}>
                      {getFirstLetter(item.user?.fullName)}
                    </Avatar>
                  }
                  title={<a href="https://ant.design">{item.user?.fullName}</a>}
                  description={item.content}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};
export default SNPost;
