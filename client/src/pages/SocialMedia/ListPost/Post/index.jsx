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
moment.locale("vi");

const Post = (props) => {
  const { post, onEdit, onDelete } = props;
  let history = useHistory();
  const handleSettings = ({ key }) => {
    switch (key) {
      case "1":
        console.log("Báo cáo");
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
    <div className="card">
      <div className="post__header">
        <img
          src={post?.poster.avatar}
          alt=""
          className={post?.poster.avatar ? "avatar" : "avatar skeleton"}
        />
        <div className="w-100">
          <p
            className={
              post?.poster.username
                ? "header__userName"
                : "header__userName  skeleton skeleton-username"
            }
            onClick={() => {
              history.push(`/profile/${post?.poster._id}`);
            }}
          >
            {post?.poster.fullName}
          </p>
          <p
            className={
              post?.audience
                ? "header__permission"
                : "header__permission  skeleton skeleton-audience"
            }
          >
            {post?.audience}{" "}
            {post?.createAt
              ? " - " + moment(post?.createAt).startOf("hour").fromNow()
              : ""}
          </p>
        </div>
        <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
          <p className="header__settings">
            <EllipsisOutlined />
          </p>
        </Dropdown>
      </div>
      <div className="post__content">
        {post?.text ? (
          <p className="post__content--text">{post?.text}</p>
        ) : (
          <div className="w-100 py-3">
            <p className="skeleton skeleton-text"></p>
            <p className="skeleton skeleton-text"></p>
            <p className="skeleton skeleton-text"></p>
            <p className="skeleton skeleton-text"></p>
          </div>
        )}

        <div
          className="post__content--attachments"
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
      </div>
      <div
        className="post__react"
        style={{
          display: props && Object.keys(props).length !== 0 ? "flex" : "none",
        }}
      >
        <button className="btn w-100">Thích</button>
        <button className="btn w-100">Bình luận</button>
        <button className="btn w-100">Chia sẻ</button>
      </div>
    </div>
  );
};
export default Post;
