import Dialog from "compoents/Dialog";
import { getUrlImage } from "util/index";
import { useState, useEffect } from "react";
import axios from "axios";
import { HTTP_CONNECT } from "config";
import { getConfig } from "util/index";
import Post from "../../Post";

import "./style.scss";

const PostDialog = ({ image, isShowPost, setShowPost }) => {
  console.log(image);
  const [post, setPost] = useState(null);
  useEffect(() => {
    getData();
  }, [image]);
  const getData = async () => {
    const res = await axios.get(
      `${HTTP_CONNECT}/post/getPostByIdImage/${image._id}`,
      getConfig()
    );
    console.log(res.data.data[0]);
    setPost(res.data.data[0]);
  };
  return (
    <div className="PostDialog" style={{justifyContent: post==undefined?"center":"unset"}}>
      <div className="PostDialog__left">
        <img width={600} height={500} src={getUrlImage(image.filePath)} />
      </div>
      {post != undefined && (
        <div className="PostDialog__right">
          {post?.poster && <Post post={post} type="dialog" />}
        </div>
      )}
    </div>
  );
};
export default PostDialog;
