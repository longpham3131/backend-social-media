import Post from "pages/SocialMedia/ListPost/Post";
import "./style.scss";

const PostDetail = () => {
  return (
    <div className="postDetail">
      <div className="postDetail__attachments">Attachments</div>
      <div className="postDetail__content">
        <Post />
      </div>
    </div>
  );
};
export default PostDetail;
