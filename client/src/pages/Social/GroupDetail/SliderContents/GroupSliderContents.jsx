import React from "react";
import { Tabs } from "antd";
import {
  OneToOneOutlined,
  SmileOutlined,
  FileImageOutlined,
  SettingOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import "./index.scss";
import GroupTimeline from "./Tabs/GroupTimeline";
import GroupMembers from "./Tabs/GroupMembers";
import GroupPhotos from "./Tabs/GroupPhotos";
import GroupSettings from "./Tabs/GroupSettings/GroupSettings";
import { useParams } from "react-router";
import GroupInviteAndRequest from "./Tabs/GroupInviteAndRequest";

const { TabPane } = Tabs;
const GroupSliderContents = ({ isAdmin }) => {
  const categories = [
    {
      icon: <OneToOneOutlined />,
      name: "Timeline",
      isDisable: true,
      ele: <GroupTimeline />,
    },
    {
      icon: <SmileOutlined />,
      name: "Members",
      isDisable: true,
      ele: <GroupMembers />,
    },
    {
      icon: <ScheduleOutlined />,
      name: "Manage Member",
      isDisable: isAdmin,
      ele: <GroupInviteAndRequest />,
    },

    // {
    //   icon: <FileImageOutlined />,
    //   name: "Photos",
    //   isDisable: false,
    //   ele: <GroupPhotos group={group} />,
    // },
    {
      icon: <SettingOutlined />,
      name: "Settings",
      isDisable: isAdmin,
      ele: <GroupSettings />,
    },
  ];
  return (
    <div className="mt-[16px] sn-slider-contents">
      <Tabs defaultActiveKey="1">
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

export default GroupSliderContents;
