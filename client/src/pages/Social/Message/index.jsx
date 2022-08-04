import userAPI from "@/apis/userAPI";
import React, { useEffect } from "react";
import { ChatEngine } from "react-chat-engine";
import { useDispatch, useSelector } from "react-redux";
import { setProfile } from "@/store/profileSlice";
import { message } from "antd";
import "./styles/index.css";
const Message = () => {
  const myProfile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      const myProfile = await userAPI.getMyProfile();
      dispatch(setProfile(myProfile.data.data));
    } catch (error) {
      console.log("error-newsfeed", error);
    }
  }, []);
  return (
    <>
      {myProfile && (
        <ChatEngine
          height="100%"
          projectID="
      3908f871-d99f-49c8-a920-0dde0a608682"
          userName={myProfile.username}
          userSecret={myProfile.password}
          // render custome component

          // renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
          // renderChatSettings={(chatAppProps) => <ChatSettings {...chatAppProps} />}
          // renderChatList={(chatAppProps) => <ChatList {...chatAppProps} />}
        ></ChatEngine>
      )}
    </>
  );
};

export default Message;
