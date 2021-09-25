import "./style.scss";
import DefaultAvatar from "assets/images/default-avatar.jpg";
import DefaultImage from "assets/images/default-image.jpg";
import moment from "moment";
import "moment/locale/vi"; // without this line it didn't work
import { Menu, Dropdown, Button, Space } from "antd";
import {
  EllipsisOutlined,
  CloseCircleOutlined,
  FormOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {getUrlImage,getUrlVideo} from "util/index"
import { useHistory } from "react-router-dom";
moment.locale("vi");

const Post = (props) => {
  const {
    userId,
    avatar,
    username,
    fullName,
    audience,
    text,
    attachments,
    createAt,
    onEdit,
    onDelete,
  } = props;
  let history = useHistory();
  // console.log(attachments);
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
          src={avatar}
          alt=""
          className={avatar ? "avatar" : "avatar skeleton"}
        />
        <div className="w-100">
          <p
            className={
              username
                ? "header__userName"
                : "header__userName  skeleton skeleton-username"
            }
            onClick={() => {
              history.push(`/profile/${userId}`);
            }}
          >
            {fullName}
          </p>
          <p
            className={
              audience
                ? "header__permission"
                : "header__permission  skeleton skeleton-audience"
            }
          >
            {audience}{" "}
            {createAt ? " - " + moment(createAt).startOf("hour").fromNow() : ""}
          </p>
        </div>
        <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
          <p className="header__settings">
            <EllipsisOutlined />
          </p>
        </Dropdown>
      </div>
      <div className="post__content">
        {text ? (
          <p className="post__content--text">{text}</p>
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
          style={{ display: attachments?.length > 0 ? "block" : "none" }}
        >
          {/* <div
            className="attachment"
            style={{
              backgroundImage: `url(${attachments ? attachments[0] : null})`,
            }}
          ></div> */}
          {(attachments?.length>0 && attachments[0].type?.split("/")[0] === "video") ?
            <video width="450" controls height="350" >
              <source  src={getUrlVideo(attachments[0].file)} />
            </video>
            : <img src={attachments?.file} alt="attachments" />
          }


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
