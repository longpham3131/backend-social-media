import { Button, Card, Image, message, Modal } from "antd";
import userAPI from "@/apis/userAPI";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import postAPI from "@/apis/postAPI";
import {
  setPostList,
  editPost,
  deletePost,
  createComment,
  likePost,
} from "@/store/postSlice";
import { setProfile } from "@/store/profileSlice";
import SNAvatar from "@/components/SNAvatar";
import { getUrlImage } from "@/util/index";
import "./styles/profile.scss";
import SNPost from "@/components/SNPost";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import CreateEditPost from "@/components/SNCreateEditPost";
import EditProfile from "./EditProfile";
import { editProfile } from "@/store/profileSlice";
import chatAPI from "@/apis/chatAPI";
const { confirm } = Modal;

const Profile = () => {
  const myProfile = useSelector((state) => state.profile);
  const postList = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [showEditPost, setShowEditPost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState("");
  const refAddEditPost = useRef(null);
  const isMyProfile = myProfile._id === userId;
  const [isFriend, setFriend] = useState(false);
  const [profile, setProfileUser] = useState(null);
  const [isFriendRequest, setFriendRequest] = useState(false);
  useEffect(() => {
    console.log("change");
    if (profile === null || !myProfile._id) return;
    if (!profile?.friendsRequest) return;
    const isAFriend =
      !!profile.friends?.find((e) => e.user._id === myProfile._id) ?? false;
    console.log(isAFriend);
    setFriend(isAFriend);
    if (!isAFriend) {
      if (profile?.friendsRequest?.length <= 0) setFriendRequest(false);
      else {
        const find = profile.friendsRequest.find(
          (e) => e.user._id == myProfile._id
        );
        find ? setFriendRequest(true) : setFriendRequest(false);
      }
    }
  }, [profile, myProfile]);

  useEffect(() => {
    if (isMyProfile) {
      setProfileUser(myProfile);
    } else {
      fetchOtherUserProfile();
    }
    fetchPostListByProfile();
  }, [userId]);

  useEffect(() => {
    if (isMyProfile) {
      setProfileUser(myProfile);
    }
  }, [myProfile]);

  const fetchOtherUserProfile = async () => {
    try {
      const res = await userAPI.getProfile(userId);
      setProfileUser(res.data);
    } catch {
      message.error("Get profile failed!");
    }
  };

  const fetchPostListByProfile = async () => {
    try {
      const postList = await postAPI.getPostList({
        limitPost: 10,
        index: 0,
        profile: 1,
        userId,
      });
      await dispatch(setPostList(postList.data));
    } catch (error) {
      message.error("Get posts failed!");
    }
  };

  const handleEditPost = async (values) => {
    values.postId = selectedPostId;
    console.log("success", values);
    try {
      const res = await postAPI.editPost(values);
      console.log("success", res.data);
      dispatch(editPost(res.data));
      message.success("Success!");
      refAddEditPost.current.resetFields();
      setShowEditPost(false);
    } catch {
      message.error("Edit post failed");
    }
  };
  const handleDeletePost = async (postId) => {
    confirm({
      title: "Are you sure you want to delete this post?",
      icon: <ExclamationCircleOutlined />,
      okText: "Confirm",
      cancelText: "Cancel",
      onOk() {
        try {
          postAPI.deletePost(postId);
          dispatch(deletePost(postId));
          message.success("Success!");
        } catch {
          message.error("Failed!");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const showEdit = async (post) => {
    await refAddEditPost.current.setFields(
      post.audience,
      post.text,
      post.attachments[0]
    );
    setShowEditPost(true);
    setSelectedPostId(post._id);
  };
  const handleComment = async (values) => {
    try {
      const res = await postAPI.comment(values);
      const dataDispatchStore = {
        ...res.data.data,
        user: {
          _id: profile._id,
          username: profile.username,
          fullName: profile.fullName,
          avatar: profile.avatar,
        },
      };
      dispatch(
        createComment({ postId: values.postId, comment: dataDispatchStore })
      );
      console.log("success", res.data);
    } catch {
      message.error("Failed!");
    }
  };
  const handleLikePost = async (postId) => {
    try {
      const res = await postAPI.likePost(postId);
      dispatch(likePost(res.data));
    } catch {
      message.error("Failed");
    }
  };
  const handleEditProfile = async (dataSubmit) => {
    try {
      const res = await userAPI.updateProfile(dataSubmit);
      dispatch(editProfile(res.data));
      await chatAPI.updateUser(res.data, dataSubmit.avatarForChat);
      message.success("Edit success");
      setShowEditProfile(false);
    } catch {
      message.error("Failed");
    }
  };

  const handleFriendRequest = async (type) => {
    let data = {
      userId: profile._id,
      type,
    };
    const res = await userAPI.friendRequest(data);
    let newFriendsRequest = profile;
    if (type == 0) {
      newFriendsRequest.friendsRequest =
        newFriendsRequest.friendsRequest.filter(
          (e) => e.user._id != myProfile._id
        );
      setFriendRequest(false);
    }
    if (type == 1) {
      newFriendsRequest.friendsRequest = [
        ...newFriendsRequest.friendsRequest,
        { user: { _id: myProfile._id } },
      ];
      setFriendRequest(true);
    }

    setProfileUser(newFriendsRequest);
  };

  const Unfriend = async () => {
    await userAPI.unfriend({ userId: profile._id });

    const res = await Promise.all([
      userAPI.getMyProfile(),
      userAPI.getProfile(profile._id),
    ]);
    console.log(res);
    dispatch(setProfile(res[0].data.data));
    setProfileUser(res[1].data);
  };
  return (
    <div className="flex flex-col p-0 lg:px-[4rem] profile-user h-full overflow-auto section--hidden-scroll-y">
      {profile && (
        <>
          <div className="shadow-2 pb-[1rem]">
            <div className="relative">
              <Image
                className="w-[100%] h-[35rem]"
                src={getUrlImage(profile.coverPicture)}
                fallback="data:image/png;base64,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"
              />
              <div className="absolute bottom-[-10px] right-[44.5%] border-2 border-gray-300 rounded-full">
                <SNAvatar
                  size={120}
                  src={profile.avatar}
                  fullName={profile.fullName}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-quicksand mb-0 mt-[2rem]">
                {profile.fullName}
              </p>
            </div>
            <div className="text-right m-6">
              {!isMyProfile && (
                <>
                  {isFriend ? (
                    <div>
                      <Button onClick={() => Unfriend()}>Unfriend</Button>
                    </div>
                  ) : (
                    <>
                      {!isFriendRequest && (
                        <div>
                          <Button onClick={() => handleFriendRequest(1)}>
                            Add friend
                          </Button>
                        </div>
                      )}
                      {!!isFriendRequest && (
                        <div>
                          <Button onClick={() => handleFriendRequest(0)}>
                            Cancel friend request
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-[3rem] flex flex-col lg:flex-row gap-[3rem] h-full px-[2rem] lg:px-0">
            <Card
              title="Profile"
              style={{ height: "fit-content" }}
              className="w-full lg:w-[35%] shadow-2 "
              actions={[
                <Button type="primary" onClick={() => setShowEditProfile(true)}>
                  Edit personal profile
                </Button>,
              ]}
            >
              <p className="flex items-center justify-between text-base">
                <span>Followers: </span>
                <span className="ml-auto">{profile.followers.length}</span>
              </p>
              <p className="flex items-center justify-between text-base">
                <span>Followings: </span>
                <span className="ml-auto">{profile.followings.length}</span>
              </p>
              <p className="flex items-center justify-between text-base">
                <span>Friends List: </span>
                <span className="ml-auto">{profile.friends.length}</span>
              </p>
            </Card>
            <EditProfile
              visible={showEditProfile}
              onEdit={handleEditProfile}
              onCancel={() => setShowEditProfile(false)}
            />
            <div className="w-full lg:w-[65%]">
              {postList.map((post) => (
                <SNPost
                  post={post}
                  key={post._id}
                  onDelete={handleDeletePost}
                  onEdit={showEdit}
                  onCommentPost={handleComment}
                  onLike={handleLikePost}
                />
              ))}
            </div>
          </div>
        </>
      )}
      <CreateEditPost
        ref={refAddEditPost}
        visible={showEditPost}
        title="Edit post"
        okText="Update"
        onClose={() => setShowEditPost(false)}
        onSubmit={handleEditPost}
      />
    </div>
  );
};
export default Profile;
