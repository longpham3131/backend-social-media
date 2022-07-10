import React from "react";
import { Tabs } from "antd";

import UpdateGroupInfo from "./Tabs/UpdateGroupInformation";
import UpdateAvatar from "./Tabs/UpdateAvatar";
import DeleteGroup from "./Tabs/DeleteGroup";
const { TabPane } = Tabs;
const GroupSettings = () => {
  const categories = [
    {
      name: "Update Group Information",
      ele: <UpdateGroupInfo />,
    },
    {
      name: "Update Avatar & Cover Picture",
      ele: <UpdateAvatar />,
    },
    {
      name: "Delete your group",
      ele: <DeleteGroup />,
    },
  ];
  return (
    <div className="col-span-4 ">
      <Tabs defaultActiveKey="1" tabPosition={"left"}>
        {categories.map((item, index) => {
          return (
            <TabPane
              tab={
                <div>
                  <p>{item.name}</p>
                </div>
              }
              key={index + 1}
            >
              <div>{item.ele}</div>
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

export default GroupSettings;
