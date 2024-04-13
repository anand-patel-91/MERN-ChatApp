import React, { useEffect } from "react";
import Message from "./Message";
import { useMessagesContext } from "../hooks/useMessagesContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Messages = () => {
  const { messages, dispatch } = useMessagesContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchMessages = async () => {
      const respnse = await fetch("/api/messages", {
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
  }, [dispatch, user]);

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
