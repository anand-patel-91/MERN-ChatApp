import React, { useEffect } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { useChatContext } from "../hooks/useChatContext";

const Chat = () => {
  const { user } = useChatContext();

  useEffect(() => {}, [user]);

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chatUserInfo">{user && <span>{user.name}</span>}</div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
