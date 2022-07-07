import React, { useRef, useState } from "react";
import { message, Modal, Skeleton, Divider } from "antd";
import postAPI from "@/apis/postAPI";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPostList, addMorePost } from "@/store/postSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import SNWidgetBox from "@/components/SNWidgetBox";
import SNWidgetBoxItem from "@/components/SNWidgetBoxItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas, faLock } from "@fortawesome/free-solid-svg-icons";
import SNPost2 from "@/components/SNPost2";

const Newsfeed = () => {
  const dispatch = useDispatch();
  const postList = useSelector((state) => state.posts);
  const profile = useSelector((state) => state.profile);
  const [loadMore, setLoadMore] = useState(true);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  // const profile = useSelector((state) => state.profile);

  useEffect(() => {
    fetchPostList();
  }, []);

  const fetchPostList = async () => {
    try {
      const postList = await postAPI.getPostList({
        limitPost: 6,
        index: 0,
      });
      await dispatch(setPostList(postList.data));
    } catch (error) {
      console.log(error);
      message.error("get post failed!");
    }
  };
  const loadMoreData = () => {
    console.log("loadmore");
    if (loading) {
      return;
    }
    setLoading(true);
    postAPI
      .getPostList({
        limitPost: 6,
        index: index + 1,
      })
      .then((postList) => {
        console.log(postList.data.length == 0);
        if (postList.data == 0) {
          setLoadMore(false);
          return;
        }
        setIndex(index + 1);
        dispatch(addMorePost(postList.data));
        setLoading(false);
      });
  };
  // Data member
  const members = [
    {
      name: "Sandra Amuda",
      avatar: profile?.avatar,
      description: "@Sandra",
    },
    {
      name: "Alex Kilo",
      avatar: profile?.avatar,
      description: "@Alex",
    },
    {
      name: "Smith Halo",
      avatar: profile?.avatar,
      description: "@Smith",
    },
    {
      name: "Johnny Deep",
      avatar: profile?.avatar,
      description: "@Johnny",
    },
    {
      name: "Mohamed Sela",
      avatar: profile?.avatar,
      description: "@Mohamed",
    },
  ];
  const groups = [
    {
      name: "Street Artists",
      avatar: profile?.avatar,
      member: "3 members",
      leftIcon: (
        <FontAwesomeIcon
          icon={faEarthAmericas}
          className=" text-lg text-color-icon"
        />
      ),
    },
    {
      name: "Cosplayers of the World",
      avatar: profile?.avatar,
      member: "5 members",
      leftIcon: (
        <FontAwesomeIcon
          icon={faEarthAmericas}
          className=" text-lg text-color-icon"
        />
      ),
    },
    {
      name: "Stream Designers",
      avatar: profile?.avatar,
      member: "3 members",
      leftIcon: (
        <FontAwesomeIcon
          icon={faEarthAmericas}
          className=" text-lg text-color-icon"
        />
      ),
    },
    {
      name: "Gaming Watchtower",
      avatar: profile?.avatar,
      member: "6 members",
      leftIcon: (
        <FontAwesomeIcon icon={faLock} className=" text-lg text-color-icon" />
      ),
    },
    {
      name: "Living in Japan",
      avatar: profile?.avatar,
      member: "1 members",
      leftIcon: (
        <FontAwesomeIcon
          icon={faEarthAmericas}
          className=" text-lg text-color-icon"
        />
      ),
    },
  ];
  // End data member
  return (
    <div className="h-full">
      <div className="grid grid-cols-4 gap-4 mt-[32px] h-full">
        <SNWidgetBox
          title={"Newest Members"}
          content={members.map((item, index) => (
            <SNWidgetBoxItem
              key={index}
              srcAvatar={item.avatar}
              name={item.name}
              description={item.description}
            />
          ))}
        />

        <div id="scrollablePost" className=" col-span-2">
          <InfiniteScroll
            dataLength={postList?.length ?? 0}
            next={loadMoreData}
            hasMore={loadMore}
            loader={
              <Skeleton
                className="w-[30rem]"
                avatar
                paragraph={{ rows: 1 }}
                active
              />
            }
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollablePost"
          >
            <div className="col-span-2">
              {postList.length > 0 &&
                postList.map((post) => <SNPost2 post={post} key={post._id} />)}
            </div>
          </InfiniteScroll>
        </div>

        <SNWidgetBox
          title={"Groups"}
          content={groups.map((item, index) => (
            <SNWidgetBoxItem
              key={index}
              srcAvatar={item.avatar}
              name={item.name}
              description={item.member}
              leftIcon={item.leftIcon}
            />
          ))}
        />
      </div>
    </div>
  );
};
export default Newsfeed;
