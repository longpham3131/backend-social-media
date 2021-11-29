import DefaultAvatar from "assets/images/default-avatar.jpg";
import DefaultImage from "assets/images/default-image.jpg";
import { useEffect, useRef, useState } from "react";
import { getUrlImage } from "util/index";
import "./style.scss";
import { likeComment, deleteComment } from "store/post/post.action";
import { useDispatch } from "react-redux";
import { formatMinutes } from "util/index";
const Comment = ({ comment, profile, postId }) => {
  const dispatch = useDispatch();
  const [isLike, setLike] = useState(false);
  const [currentComment, setCurrentComment] = useState(comment);
  useEffect(() => {
    console.log("change");
    const like = !!currentComment.like.find((e) => e.user._id === profile._id);
    setLike(like);
  }, [currentComment.like.length, currentComment.like]);
  const handleLikeComment = (type) => {
    console.log(currentComment.like);
    let data = {
      commentId: comment._id,
      type,
      postId,
    };
    dispatch(likeComment(data));

    let newComment = currentComment;

    if (type == 1) {
      newComment.like.push({
        user: profile,
        createAt: Date.now,
      });
    }
    if (type == 0) {
      newComment.like = newComment.like.filter(
        (e) => e.user._id !== profile._id
      );
    }
    setCurrentComment(newComment);
  };
  return (
    <div className="comment">
      <img
        src={
          comment.user?.avatar != ""
            ? getUrlImage(comment.user?.avatar)
            : DefaultAvatar
        }
        alt=""
        className="avatar"
      />
      <div className="comment__wrapperContent">
        <div className="comment__content">
          <p className="comment__owner">{comment.user?.fullName}</p>
          <p className="comment__text">{comment?.content}</p>
        </div> 
        {!!comment.file?.filePath ? (
          <div className="comment__attachment">
            <img src={getUrlImage(comment.file?.filePath)} alt="" />
          </div>
        ) : (
          <></>
        )}
        <div className="comment__footer">
          {isLike ? (
            <div className="comment__react">
              <span
                className="comment__like comment__like--active"
                onClick={() => handleLikeComment(0)}
              >
                Bỏ Thích
              </span>
              {/* <span className="comment__repply ">Phản hồi</span> */}
            </div>
          ) : (
            <div className="comment__react">
              <span
                className="comment__like comment__like--active"
                onClick={() => handleLikeComment(1)}
              >
                Thích
              </span>
              {/* <span className="comment__repply ">Phản hồi</span> */}
            </div>
          )}
          <div className="comment__react">
            <span className="comment__time">
              {formatMinutes(comment.createAt)}
            </span>
            {/* <span className="comment__repply ">Phản hồi</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
