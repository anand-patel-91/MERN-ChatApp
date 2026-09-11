import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { useMessagesContext } from "../hooks/useMessagesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";
import { API_URL } from "../config";
import LoadingSpinner from "./LoadingSpinner";

const Messages = () => {
  const { messages, dispatch } = useMessagesContext();
  const { user } = useAuthContext();
  const { chatId } = useChatContext();
  const lastMessageTimestamp = useRef(null);
  const hasLoadedMessages = useRef(false);
  const knownMessageIds = useRef(new Set());
  const [loading, setLoading] = React.useState(false);
  const [loadError, setLoadError] = React.useState("");

  useEffect(() => {
    if (!user || !chatId) {
      return;
    }

    lastMessageTimestamp.current = null;
    hasLoadedMessages.current = false;
    knownMessageIds.current = new Set();
    setLoading(true);
    setLoadError("");
    let cancelled = false;

    const fetchMessages = async () => {
      try {
        const since = lastMessageTimestamp.current
          ? `?since=${encodeURIComponent(lastMessageTimestamp.current)}`
          : "";
        const sync = hasLoadedMessages.current ? "&sync=1" : "";
        const response = await fetch(
          `${API_URL}/api/messages/${chatId}${since}${since ? sync : ""}`,
          {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          }
        );
        const json = await response.json().catch(() => ({}));

        if (!cancelled && response.ok) {
          setLoading(false);
          if (!hasLoadedMessages.current) {
            hasLoadedMessages.current = true;
            if (json.length) {
              knownMessageIds.current = new Set(json.map((message) => message._id));
              lastMessageTimestamp.current = json[json.length - 1].timestamp;
            }
            dispatch({ type: "SET_MESSAGES", payload: json });

            await fetch(`${API_URL}/api/userChats/${chatId}/read`, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
          } else {
            const currentIds = new Set(json.currentIds || []);
            const deletedIds = [...knownMessageIds.current].filter(
              (messageId) => !currentIds.has(messageId)
            );

            if (deletedIds.length) {
              deletedIds.forEach((messageId) => knownMessageIds.current.delete(messageId));
              dispatch({ type: "REMOVE_MESSAGES", payload: deletedIds });
            }

            if (json.messages?.length) {
              json.messages.forEach((message) => knownMessageIds.current.add(message._id));
              lastMessageTimestamp.current = json.messages[json.messages.length - 1].timestamp;
              dispatch({ type: "APPEND_MESSAGES", payload: json.messages });

              await fetch(`${API_URL}/api/userChats/${chatId}/read`, {
                method: "PATCH",
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              });
            }
          }
        } else if (!cancelled) {
          setLoading(false);
          setLoadError(json.error || "Unable to load messages");
        }
      } catch (error) {
        if (!cancelled) {
          setLoading(false);
          setLoadError("Unable to connect to the server");
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
      {loading ? (
        <LoadingSpinner label="Loading messages" />
      ) : loadError ? (
        <p className="inline-error">{loadError}</p>
      ) : messages ? (
        messages.map((message) => (
          <Message message={message} key={message._id} />
        ))
      ) : null}
    </div>
  );
};

export default Messages;
