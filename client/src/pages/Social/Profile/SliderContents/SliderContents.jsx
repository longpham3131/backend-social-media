import React from "react";
import { Tabs } from "antd";
import {
  UserOutlined,
  OneToOneOutlined,
  SmileOutlined,
  TeamOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import "./index.scss";
import About from "./Tabs/About";
import Timeline from "./Tabs/Timeline";
import Friends from "./Tabs/Friends";
import Groups from "./Tabs/Groups";
import Photos from "./Tabs/Photos";

const { TabPane } = Tabs;
const SliderContents = ({ user }) => {
  const onChange = (key) => {
    console.log(key);
  };
  const categories = [
    {
      icon: <UserOutlined />,
      name: "About",
      isDisable: false,
      ele: <About user={user} />,
    },
    {
      icon: <OneToOneOutlined />,
      name: "Timeline",
      isDisable: false,
      ele: <Timeline user={user} />,
    },
    {
      icon: <SmileOutlined />,
      name: "Friends",
      isDisable: false,
      ele: <Friends user={user} />,
    },
    {
      icon: <TeamOutlined />,
      name: "Groups",
      isDisable: false,
      ele: <Groups user={user} />,
    },

    {
      icon: <FileImageOutlined />,
      name: "Photos",
      isDisable: false,
      ele: <Photos user={user} />,
    },
  ];
  return (
    <div className="mt-[16px] sn-slider-contents">
      <Tabs defaultActiveKey="2" onChange={onChange}>
        {categories.map((item, index) => {
          return (
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
          );
        })}
      </Tabs>
    </div>
  );
};

export default SliderContents;
