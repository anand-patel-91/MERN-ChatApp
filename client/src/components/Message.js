import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const Message = ({ message }) => {
  const { content } = message;

  return (
    <div className="message">
      <div className="messageContent">
        <p>{content}</p>
        <span className="messageInfo">
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  );
};

export default Message;
