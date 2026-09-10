import React from "react";
import Messages from "./Messages";
import Input from "./Input";
import { useChatContext } from "../hooks/useChatContext";
import { useMessagesContext } from "../hooks/useMessagesContext";

const Chat = () => {
  const { chat, dispatch } = useChatContext();
  const { dispatch: messagesDispatch } = useMessagesContext();

  const handleBack = () => {
    dispatch({ type: "LOGOUT" });
    messagesDispatch({ type: "LOGOUT" });
  };

  return (
    <div className="chat">
      <div className="chatInfo">
        <button
          className="mobile-back"
          onClick={handleBack}
          aria-label="Back to contacts"
        >
          &larr;
        </button>
        <div className="chatUserInfo">
          {chat?.profilePic && <img src={chat.profilePic} alt="" />}
          <span>{chat?.name || "Select a conversation"}</span>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
