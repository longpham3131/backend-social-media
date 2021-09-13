import "./style.scss";
import DefaultAvatar from "../../../../../assets/images/default-avatar.jpg";
import DefaultImage from "../../../../../assets/images/default-image.jpg";
const Post = (props) => {
  const { avatar, username, audience, text, attachments } = props;
  console.log("PROPS", props);
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
          >
            {username}
          </p>
          <p
            className={
              audience
                ? "header__permission"
                : "header__permission  skeleton skeleton-audience"
            }
          >
            {audience}
          </p>
        </div>
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
          style={{ display: attachments ? "block" : "none" }}
        >
          <div
            className="attachment"
            style={{ backgroundImage: `url(${attachments})` }}
          ></div>
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
