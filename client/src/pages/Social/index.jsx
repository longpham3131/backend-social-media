import { Avatar, Carousel, Layout, List, message } from "antd";

import React, { useEffect, useState } from "react";
import "./styles/index.scss";
import userAPI from "@/apis/userAPI";
import { useDispatch, useSelector } from "react-redux";

import { Route, Routes, useLocation } from "react-router";
import Newsfeed from "./Newsfeed/Newsfeed";

import Profile from "./Profile/Profile";
import PostDetail from "./PostDetail/PostDetail";
import Siderbar from "./Siderbar/Siderbar";
import Header from "./Header/Header";
import { setProfile } from "@/store/profileSlice";
import getFirstLetter from "@/util/getFirstLetter";
import { Link } from "react-router-dom";
import SNAvatar from "@/components/SNAvatar";
import Message from "./Message";
import { makeid } from "@/util/index";
import Banner from "./Banner/Banner";
import Members from "./Members";
import Groups from "./Groups";
import GroupDetail from "./GroupDetail/GroupDetail";
import SearchPage from "./SearchPage";
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
      <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <Layout className="site-layout">
        <Siderbar
          collapsed={collapsed}
          onClose={() => setCollapsed(!collapsed)}
        />
        <Content
          className="site-layout-background min-h-[28rem] w-full m-0 lg:mt-[2.4rem] lg:ml-[1.6rem] overflow-auto"
          id="scrollablePost"
        >
          <div className="w-full h-full">
            <div className={`h-full w-[1184px] mx-auto `}>
              <Banner />
              <Routes>
                <Route path="/" element={<Newsfeed />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/post/:postId" element={<PostDetail />} />
                <Route path="/search" element={<SearchPage />} />

                <Route path="/members" element={<Members />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/:groupId" element={<GroupDetail />} />
                <Route path="/message" element={<Message />} />
              </Routes>
            </div>
            <PostDetail />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Social;
