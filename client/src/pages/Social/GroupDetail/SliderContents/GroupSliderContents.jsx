import React from "react";
import { Tabs } from "antd";
import {
  OneToOneOutlined,
  SmileOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import "./index.scss";
import GroupTimeline from "./Tabs/GroupTimeline";
import GroupMembers from "./Tabs/GroupMembers";
import GroupPhotos from "./Tabs/GroupPhotos";

const { TabPane } = Tabs;
const GroupSliderContents = ({ group }) => {
  const onChange = (key) => {
    console.log(key);
  };
  const categories = [
    {
      icon: <OneToOneOutlined />,
      name: "Timeline",
      isDisable: false,
      ele: <GroupTimeline group={group} />,
    },
    {
      icon: <SmileOutlined />,
      name: "Friends",
      isDisable: false,
      ele: <GroupMembers group={group} />,
    },

    {
      icon: <FileImageOutlined />,
      name: "Photos",
      isDisable: false,
      ele: <GroupPhotos group={group} />,
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

export default GroupSliderContents;
