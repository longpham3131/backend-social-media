import { Avatar, Carousel, Layout, List, message } from "antd";

import React, { useEffect, useState } from "react";
import "./styles/index.scss";
import userAPI from "@/apis/userAPI";
import { useDispatch, useSelector } from "react-redux";

import { Route } from "react-router";
import Newsfeed from "./Newsfeed";
import SearchFriend from "./SearchFriend";

import Profile from "./Profile";
import Siderbar from "./Siderbar";
import Header from "./Header";
import { setProfile } from "@/store/profileSlice";
import getFirstLetter from "@/util/getFirstLetter";

const { Content } = Layout;

const Social = () => {
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false);
  const profile = useSelector((state) => state.profile);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      const myProfile = await userAPI.getMyProfile();
      dispatch(setProfile(myProfile.data.data));
      message.success("Chào mừng bạn quay lại");
    } catch (error) {
      console.log("error-newsfeed", error);
    }
  }, []);
  return (
    <Layout className="w-full h-screen newsfeed">
      <Siderbar collapsed={collapsed} />
      <Layout className="site-layout">
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",

            minHeight: 280,
          }}
        >
          <div className="flex justify-between w-full h-full">
            <div className="h-full w-[75%] p-[2.4rem]">
              <Route path="/newsfeed" render={() => <Newsfeed />} exact />
              <Route
                path="/newsfeed/profile"
                render={(props) => <Profile {...props} />}
              />
              <Route
                path="/newsfeed/search-friend"
                render={(props) => <SearchFriend {...props} />}
              />
            </div>
            <div className="border-l-4  h-full w-[25%] ">
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
                      Danh sách bạn
                    </p>
                    <List
                      itemLayout="horizontal"
                      dataSource={profile.friends}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar src={item.user.avatar}>
                                {getFirstLetter(item.user.fullName)}
                              </Avatar>
                            }
                            title={
                              <a href="https://ant.design">
                                {item.user.fullName}
                              </a>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </>
                ) : (
                  <p className="mb-[1.2rem] text-md font-quicksand font-semi-bold text-gray-5 text-center">
                    Danh sách bạn bè đang trống.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Social;
