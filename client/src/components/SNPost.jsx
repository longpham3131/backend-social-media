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
const { Meta } = Card;
const SNPost = () => {
  const [avatar, setAvatar] = useState("");
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
  const data = [
    {
      title: "Ant Design Title 1",
    },
    {
      title: "Ant Design Title 2",
    },
    {
      title: "Ant Design Title 3",
    },
    {
      title: "Ant Design Title 4",
    },
  ];
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
    <div className="flex items-center justify-center">
      <div className="flex items-start justify-center mt-[1.6rem] border w-fit-content">
        <Badge.Ribbon text="Công khai" placement="start">
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
              <Dropdown overlay={menu} placement="bottomRight" arrow>
                <MoreOutlined />
              </Dropdown>
            }
          >
            <Meta
              style={{ height: 300, marginTop: "25px" }}
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title="Card title"
              description="This is the description"
            />
          </Card>
        </Badge.Ribbon>

        <Card
          title="Bình luận"
          style={{ width: 450 }}
          bodyStyle={{
            padding: "1.6rem",
            overflow: "auto",
            maxHeight: "35rem",
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
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
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
