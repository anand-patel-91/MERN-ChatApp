import React, { useEffect } from "react";
import Message from "./Message";
import { useMessagesContext } from "../hooks/useMessagesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";
import { API_URL } from "../config";

const Messages = () => {
  const { messages, dispatch } = useMessagesContext();
  const { user } = useAuthContext();
  const { chatId } = useChatContext();

  useEffect(() => {
    if (!user || !chatId) {
      return;
    }

    let cancelled = false;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/messages/${chatId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (!cancelled && response.ok) {
          dispatch({ type: "SET_MESSAGES", payload: json });
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to load messages:", error);
        }
      }
    };

    fetchMessages();
    const pollingId = setInterval(fetchMessages, 2000);

    return () => {
      cancelled = true;
      clearInterval(pollingId);
    };
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
