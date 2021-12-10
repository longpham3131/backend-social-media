import { Layout, message } from "antd";

import React, { useEffect, useState } from "react";
import "./styles/index.scss";
import userAPI from "@/apis/userAPI";
import { useDispatch } from "react-redux";

import { Route } from "react-router";
import Newsfeed from "./Newsfeed";
import SearchFriend from "./SearchFriend";

import Profile from "./Profile";
import Siderbar from "./Siderbar";
import Header from "./Header";
import { setProfile } from "@/store/profileSlice";

const { Content } = Layout;

const Social = () => {
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(false);

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
              <Route
                path="/newsfeed"
                render={(props) => <Newsfeed {...props} />}
                exact
              />
              <Route
                path="/newsfeed/profile"
                render={(props) => <Profile {...props} />}
              />
              <Route
                path="/newsfeed/search-friend"
                render={(props) => <SearchFriend {...props} />}
              />
            </div>
            <div className="border-l-4 border-indigo-600 h-full w-[25%] p-[2.4rem]"></div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Social;
