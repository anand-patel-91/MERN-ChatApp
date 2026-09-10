import React, { useState } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { useChatContext } from "../hooks/useChatContext";
import { useMessagesContext } from "../hooks/useMessagesContext";
import ImageModal from "./ImageModal";

const Chat = () => {
  const { chat, dispatch } = useChatContext();
  const { dispatch: messagesDispatch } = useMessagesContext();
  const [showImage, setShowImage] = useState(false);

  const handleBack = () => {
    dispatch({ type: "LOGOUT" });
    messagesDispatch({ type: "LOGOUT" });
  };

  return (
    <div className="chat">
      <div className="chatInfo">
        {chat?._id && (
          <button
            className="chat-exit"
            onClick={handleBack}
            aria-label="Exit conversation"
          >
            <span className="chat-exit-desktop">&times;</span>
            <span className="chat-exit-mobile">&larr;</span>
          </button>
        )}
        <div className="chatUserInfo">
          {chat?.profilePic && (
            <button className="image-button chat-avatar-button" type="button" onClick={() => setShowImage(true)}>
              <img src={chat.profilePic} alt="" />
            </button>
          )}
          <span>{chat?.name || "Select a conversation"}</span>
        </div>
      </div>
      {chat?._id ? (
        <Messages />
      ) : (
        <div className="chat-empty">
          <strong>Your conversations live here</strong>
          <span>Select someone from the sidebar to start chatting.</span>
        </div>
      )}
      <Input />
      {showImage && (
        <ImageModal
          src={chat.profilePic}
          alt={`${chat.name} profile picture`}
          onClose={() => setShowImage(false)}
        />
      )}
    </div>
  );
};

export default Chat;
