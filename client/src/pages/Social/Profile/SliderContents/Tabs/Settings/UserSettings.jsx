import { Tabs } from "antd";
import React from "react";
import { KeyOutlined, ProfileOutlined } from "@ant-design/icons";
import UpdateBiography from "./Tabs/UpdateBiography";
import UpdatePassword from "./Tabs/UpdatePassword";
import UpdateInterests from "./Tabs/UpdateInterests";
const { TabPane } = Tabs;
const UserSettings = () => {
  const categories = [
    {
      name: "Biography",
      isDisable: false,
      ele: <UpdateBiography />,
    },
    {
      name: "Update interests",
      isDisable: false,
      ele: <UpdateInterests />,
    },
    {
      name: "Update password",
      isDisable: false,
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
