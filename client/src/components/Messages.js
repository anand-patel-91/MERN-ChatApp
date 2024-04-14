import React, { useEffect } from "react";
import Message from "./Message";
import { useMessagesContext } from "../hooks/useMessagesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";

const Messages = () => {
  const { messages, dispatch } = useMessagesContext();
  const { user } = useAuthContext();
  const {chatId} = useChatContext();

  useEffect(() => {
    if(chatId===null){
      return
    }
    const fetchMessages = async () => {
      const respnse = await fetch(`/api/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await respnse.json();

      if (respnse.ok) {
        dispatch({ type: "SET_MESSAGES", payload: json });
      }
    };

    if (user) {
      fetchMessages();
    }
  }, [dispatch, user, chatId]);

  return (
    <div className="messages">
      {messages &&
        messages.map((message) => (
          <Message message={message} key={message._id} />
        ))}
    </div>
  );
};

export default Messages;
