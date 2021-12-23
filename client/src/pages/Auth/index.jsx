import { Card } from "antd";
import { useState } from "react";
import Login from "./Login";
import React from "react";
import Register from "./Register";
const AuthPage = () => {
  const tabList = [
    {
      key: "login",
      tab: "Login",
    },
    {
      key: "register",
      tab: "Register",
    },
  ];
  const [activeTabKey, setActiveTabKey] = useState("login");
  const contentList = {
    login: <Login />,
    register: <Register onSuccess={() => setActiveTabKey("login")} />,
  };

  const onTabChange = (key) => {
    setActiveTabKey(key);
  };
  return (
    <div className="p-[5rem] h-screen flex items-center justify-center bg-gradient-to-r from-green-300 via-green-400 to-green-500">
      <div className="flex items-center justify-around gap-[1rem] w-full">
        <div className="text-center hidden lg:block">
          <img
            src="https://dotnettrickscloud.blob.core.windows.net/uploads/CourseImages/becomeamernstackdeveloper-mobile.png"
            className="mx-auto"
            alt=""
          />
        </div>
        <div className="w-[50rem] shadow">
          <Card
            style={{ width: "100%" }}
            tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={(key) => {
              onTabChange(key);
            }}
          >
            {contentList[activeTabKey]}
          </Card>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
