import React, { useState } from "react";
import { Tabs } from "antd";
import {
  UserOutlined,
  OneToOneOutlined,
  SmileOutlined,
  TeamOutlined,
  FileImageOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import About from "./Tabs/About";
import Timeline from "./Tabs/Timeline";
import Friends from "./Tabs/Friends";
import Groups from "./Tabs/Groups";
import Photos from "./Tabs/Photos";
import UserSettings from "./Tabs/Settings/UserSettings";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

const { TabPane } = Tabs;
const SliderContents = ({ user }) => {
  const { userId } = useParams();
  const myProfile = useSelector((state) => state.profile);
  const [activeKey, setActiveKey] = useState("2");
  const categories = [
    {
      icon: <UserOutlined />,
      name: "About",
      isDisable: true,
      ele: <About user={user} />,
    },
    {
      icon: <OneToOneOutlined />,
      name: "Timeline",
      isDisable: true,
      ele: <Timeline user={user} changeTab={(value) => setActiveKey(value)} />,
    },
    {
      icon: <SmileOutlined />,
      name: "Friends",
      isDisable: true,
      ele: <Friends user={user} />,
    },
    {
      icon: <TeamOutlined />,
      name: "Groups",
      isDisable: true,
      ele: <Groups user={user} />,
    },

    {
      icon: <FileImageOutlined />,
      name: "Media",
      isDisable: true,
      ele: <Photos user={user} />,
    },
    {
      icon: <SettingOutlined />,
      name: "Settings",
      isDisable: userId === myProfile._id,
      ele: <UserSettings />,
    },
  ];
  return (
    <div className="mt-[16px] sn-slider-contents">
      <Tabs activeKey={activeKey} onTabClick={(key) => setActiveKey(key)}>
        {categories.map((item, index) => {
          return (
            item.isDisable && (
              <TabPane
                tab={
                  <div className="sn-slider-contents-item">
                    {item.icon}
                    <p>{item.name}</p>
                  </div>
                }
                key={index + 1}
              >
                <div className="grid grid-cols-4 gap-[16px] pb-[24px]">
                  {item.ele}
                </div>
              </TabPane>
            )
          );
        })}
      </Tabs>
    </div>
  );
};

export default SliderContents;
