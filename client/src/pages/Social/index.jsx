import { Avatar, Carousel, Layout, List, message } from "antd";

import React, { useEffect, useState } from "react";
import "./styles/index.scss";
import userAPI from "@/apis/userAPI";
import { useDispatch, useSelector } from "react-redux";

import { Route, Routes, useLocation } from "react-router";
import Newsfeed from "./Newsfeed";
import SearchFriend from "./SearchFriend";

import Profile from "./Profile/Profile";
import PostDetail from "./PostDetail/PostDetail";
import Siderbar from "./Siderbar";
import Header from "./Header/Header";
import { setProfile } from "@/store/profileSlice";
import getFirstLetter from "@/util/getFirstLetter";
import { Link } from "react-router-dom";
import SNAvatar from "@/components/SNAvatar";
import Message from "./Message";
import { makeid } from "@/util/index";
const { Content } = Layout;

const Social = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const profile = useSelector((state) => state.profile);
  // console.log("history", history);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      const myProfile = await userAPI.getMyProfile();
      dispatch(setProfile(myProfile.data.data));
      message.success("Welcome back!");
      // sendEmail();
    } catch (error) {
      console.log("error-newsfeed", error);
    }
  }, []);

  useEffect(() => {
    function getProfile() {
      userAPI.getMyProfile().then((rs) => dispatch(setProfile(rs.data.data)));
    }
    getProfile();
    const interval = setInterval(() => getProfile(), 1000 * 60);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <Layout className="w-full h-screen newsfeed">
      <Siderbar
        collapsed={collapsed}
        onClose={() => setCollapsed(!collapsed)}
      />
      <Layout className="site-layout">
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        <Content className="site-layout-background min-h-[28rem] w-full m-0 lg:my-[2.4rem] lg:mx-[1.6rem]">
          <div className="flex justify-between w-full h-full">
            <div
              className={`h-full  ${
                location.pathname !== "/message"
                  ? "w-full lg:w-[75%]"
                  : "w-full"
              } `}
            >
              <Routes>
                <Route path="/" element={<Newsfeed />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/post/:postId" element={<PostDetail />} />
                <Route path="/search-friend" element={<SearchFriend />} />
                <Route path="/message" element={<Message />} />
              </Routes>
            </div>
            {/* Không hiện Friends List bè khi đang ở trang Messages */}
            {location.pathname !== "/message" && (
              <div className="border-l-4  h-full hidden lg:block lg:w-[25%] ">
                <div className=" w-full mb-[1.2rem]">
                  <Carousel autoplay>
                    {/* <div>
                    <img
                      src="/src/assets/images/ads-1.jpg"
                      style={contentStyleCarousel}
                      alt="ads-img"
                    />
                  </div> */}
                    <div>
                      <div
                        className="w-[100%] h-[25rem] "
                        style={{
                          background: `url('https://alsecco.co.uk/wp-content/themes/yootheme/cache/1-final-d6777e9b.jpeg')`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                        alt="ads-img"
                      ></div>
                    </div>
                    <div>
                      <div
                        className="w-[100%] h-[25rem] "
                        style={{
                          background: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQThES0xolfpy15PS-mJ45O-HkITqX42QhhiA&usqp=CAU')`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                        alt="ads-img"
                      ></div>
                    </div>
                    <div>
                      <div
                        className="w-[100%] h-[25rem] "
                        style={{
                          background: `url('https://www.thoughtco.com/thmb/TS2GuSTQNysrYLJTOV2Upeeuheg=/1280x853/filters:fill(auto,1)/106481665-56a9f7393df78cf772abc9ba.jpg')`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                        alt="ads-img"
                      ></div>
                    </div>
                  </Carousel>
                </div>

                <div className="px-[1.2rem]">
                  {profile.friends && profile.friends.length > 0 ? (
                    <>
                      <p className="mb-[1.2rem] text-md font-quicksand font-semi-bold text-gray-5">
                        Friends List
                      </p>
                      <List
                        itemLayout="horizontal"
                        dataSource={profile.friends}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <SNAvatar
                                  src={item.user.avatar}
                                  fullName={item.user.fullName}
                                  isOnline={item.user.isOnline}
                                />
                              }
                              title={
                                <Link to={`/profile/${item.user._id}`}>
                                  {item.user.fullName}
                                </Link>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </>
                  ) : (
                    <p className="mb-[1.2rem] text-md font-quicksand font-semi-bold text-gray-5 text-center">
                      Friends List is empty.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Social;
