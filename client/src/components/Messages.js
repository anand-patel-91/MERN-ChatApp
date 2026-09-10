import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { useMessagesContext } from "../hooks/useMessagesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";
import { API_URL } from "../config";

const Messages = () => {
  const { messages, dispatch } = useMessagesContext();
  const { user } = useAuthContext();
  const { chatId } = useChatContext();
  const lastMessageTimestamp = useRef(null);
  const hasLoadedMessages = useRef(false);

  useEffect(() => {
    if (!user || !chatId) {
      return;
    }

    lastMessageTimestamp.current = null;
    hasLoadedMessages.current = false;
    let cancelled = false;

    const fetchMessages = async () => {
      try {
        const since = lastMessageTimestamp.current
          ? `?since=${encodeURIComponent(lastMessageTimestamp.current)}`
          : "";
        const response = await fetch(`${API_URL}/api/messages/${chatId}${since}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (!cancelled && response.ok) {
          if (!hasLoadedMessages.current) {
            hasLoadedMessages.current = true;
            if (json.length) {
              lastMessageTimestamp.current = json[json.length - 1].timestamp;
            }
            dispatch({ type: "SET_MESSAGES", payload: json });

            await fetch(`${API_URL}/api/userChats/${chatId}/read`, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
          } else if (json.length) {
            lastMessageTimestamp.current = json[json.length - 1].timestamp;
            dispatch({ type: "APPEND_MESSAGES", payload: json });

            await fetch(`${API_URL}/api/userChats/${chatId}/read`, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
          }
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
