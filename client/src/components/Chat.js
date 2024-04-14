import React, { useEffect } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { useChatContext } from "../hooks/useChatContext";

const Chat = () => {
  const { chat } = useChatContext();

  useEffect(() => {}, [chat]);

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chatUserInfo">{chat && <span>{chat.name}</span>}</div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
