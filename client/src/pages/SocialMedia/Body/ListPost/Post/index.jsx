import "./style.scss";
import DefaultAvatar from "../../../../../assets/images/default-avatar.jpg";
import DefaultImage from "../../../../../assets/images/default-image.jpg";
const Post = () => {
  return (
    <div className="post">
      <div className="post__header">
        <img src={DefaultAvatar} alt="avatar" className="avatar" />
        <div>
          <p className="header__userName">Phạm Hoàng Long</p>
          <p className="header__permission">Công khai</p>
        </div>
      </div>
      <div className="post__content">
        <p className="post__content--text">Hôm nay là một ngày như con cặc</p>
        <div className="post__content--attachments">
          <div
            className="attachment"
            style={{ backgroundImage: `url(${DefaultImage})` }}
          ></div>
        </div>
      </div>
      <div className="post__react">
        <button className="btn w-100">Thích</button>
        <button className="btn w-100">Bình luận</button>
        <button className="btn w-100">Chia sẻ</button>
      </div>
    </div>
  );
};
export default Post;
