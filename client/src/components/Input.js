import React, { useState } from "react";
import { useMessagesContext } from "../hooks/useMessagesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";

const Input = () => {
  const [message, setMessage] = useState("");
  const { dispatch } = useMessagesContext();
  const { user } = useAuthContext();
  const { chat, chatId } = useChatContext();

  const saveToMessages = async (text) => {
    const response = await fetch("api/messages/", {
      method: "POST",
      body: JSON.stringify({ chatId, content: text, senderId: user._id }),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      setMessage("");
      dispatch({ type: "SEND_MESSAGE", payload: json });
    }
  };

  const saveToUserChats = async (text) => {
    await fetch("/api/userChats", {
      method: "POST",
      body: JSON.stringify({
        chatId,
        content: text,
        Id: user._id,
        user:chat
      }),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    
    await fetch("/api/userChats", {
      method: "POST",
      body: JSON.stringify({
        chatId,
        content: text,
        Id: chat._id,
        user: {
          name: user.name,
          _id: user._id,
        },
      }),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
  };

  const handleClick = async (text) => {
    if (!message.length) return;

    if (!user) {
      return;
    }

    saveToMessages(message.trimEnd());

    saveToUserChats(message.trimEnd());
  };

  return (
    <div className="input">
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value.trimStart())}
        value={message}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleClick();
        }}
        placeholder="Hi.."
        disabled={!chatId}
      />
      <div className="send">
        <button onClick={handleClick} disabled={!chatId}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
