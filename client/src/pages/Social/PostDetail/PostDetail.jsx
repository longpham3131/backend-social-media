import { message, Modal } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import postAPI from "@/apis/postAPI";
import { setPostList } from "@/store/postSlice";
import { getUrlImage } from "@/util/index";
import "./PostDetail.scss";
import { WarningOutlined } from "@ant-design/icons";
import { SocketContext } from "@/service/socket/SocketContext";
import SNPost2 from "@/components/SNPost2";
import classNames from "classnames";
import { getUrlVideo } from "@/util/index";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { editModalPost } from "@/store/modalPostSlice";
const { confirm } = Modal;

const PostDetail = () => {
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state.profile);
  const modalPost = useSelector((state) => state.modalPost);
  const dispatch = useDispatch();
  const [post, setPost] = useState();
  const [hasAtt, setHasAtt] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (modalPost.postId) {
      fetchPostListByProfile();
    }
  }, [modalPost.postId]);

  useEffect(() => {
    if (post) {
      console.log("change select", post.text, modalPost.mediaSelectedId);
      setSelectedItem(
        post.attachments.findIndex(
          (att) => att._id === modalPost.mediaSelectedId
        )
      );
    }
  }, [modalPost.postId && modalPost.mediaSelectedId]);

  const fetchPostListByProfile = async () => {
    console.log("fetch post detail");
    try {
      const res = await postAPI.getPostList({
        limitPost: 10,
        index: 0,
        profile: 0,
        postId: modalPost.postId,
      });

      setHasAtt(res.data[0].attachments.length > 0 ? true : false);
      setPost(res.data[0]);
    } catch (error) {
      console.log(error);
      message.error("Get posts failed!");
    }
  };

  return (
    <>
      <Modal
        wrapClassName="sn-post-detail"
        centered
        width="auto"
        title="Post detail"
        visible={modalPost.show}
        footer={null}
        onCancel={() => {
          dispatch(editModalPost({ show: false }));
        }}
      >
        {post ? (
          <div className="flex items-center justify-center h-full">
            <div
              className={classNames("bg-white rounded-xl", {
                " grid grid-cols-3": hasAtt,
              })}
            >
              {hasAtt && (
                <div className="bg-black col-span-2 ">
                  <Carousel
                    showThumbs={false}
                    selectedItem={selectedItem}
                    swipeable={false}
                  >
                    {post.attachments.map((att, index) => (
                      <div className="h-full" key={index}>
                        <div className="flex items-center justify-center h-full w-full">
                          {att.fileType === "video/mp4" ? (
                            <video controls key={index}>
                              <source src={getUrlVideo(att.filePath)} />
                            </video>
                          ) : (
                            <img
                              src={getUrlImage(att.filePath)}
                              className=" object-cover"
                              alt=""
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}
              <div>
                <SNPost2
                  post={post}
                  isPostDetail={true}
                  onSuccessAct={fetchPostListByProfile}
                />
                {/* <SNWidgetBoxItem srcAvatar={post.poster.avatar} name={post.poster.fullName} description={getAudience(post.audience) + {" "} + } /> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center flex-col mt-6">
            <WarningOutlined className="WarningOutlined" />
            <div className="flex flex-row items-end">
              <p className="mr-2 text-3xl">No posts found </p>
              <a className="mr-2 text-3xl" href="/">
                Go back to HomePage
              </a>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
export default PostDetail;
