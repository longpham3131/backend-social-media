import { Tabs } from "antd";
import React from "react";

import UpdateBiography from "./Tabs/UpdateBiography";
import UpdatePassword from "./Tabs/UpdatePassword";
import UpdateInterests from "./Tabs/UpdateInterests";
import UpdateAvatarUser from "./Tabs/UpdateAvatarUser";
const { TabPane } = Tabs;
const UserSettings = () => {
  const categories = [
    {
      name: "Update avatar & cover picture",
      ele: <UpdateAvatarUser />,
    },
    {
      name: "Update profile",
      ele: <UpdateBiography />,
    },
    {
      name: "Update interests",
      ele: <UpdateInterests />,
    },
    {
      name: "Update password",
      ele: <UpdatePassword />,
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

export default UserSettings;
