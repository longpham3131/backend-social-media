import DefaultAvatar from "assets/images/default-avatar.jpg";
import DefaultImage from "assets/images/default-image.jpg";

import { getUrlImage } from "util/index";
import "./style.scss";

const Comment = () => {
  return (
    <div className="comment">
      <img src={DefaultAvatar} alt="" className="avatar" />
      <div className="comment__wrapperContent">
        <div className="comment__content">
          <p className="comment__owner">Phạm Hoàng Long</p>
          <p className="comment__text">Long đẹp trai</p>
        </div>

        <div className="comment__attachment">
          <img src={DefaultImage} alt="" />
        </div>

        <div className="comment__react">
          <span className="comment__like comment__like--active">Thích</span>
          <span className="comment__repply ">Phản hồi</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
