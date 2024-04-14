import React, { useEffect, useRef } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../hooks/useAuthContext";

const Message = ({ message }) => {
  const { content } = message;
  const ref = useRef();
  const { user } = useAuthContext();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === user._id && "owner"}`}
    >
      <div className="messageContent">
        <p>{content}</p>
        <span className="messageInfo">
          {formatDistanceToNow(new Date(message.timestamp), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
};

export default Message;
