import React, { useEffect, useRef, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../hooks/useAuthContext";
import ImageModal from "./ImageModal";

const Message = ({ message }) => {
  const { content, attachment } = message;
  const ref = useRef();
  const { user } = useAuthContext();
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === user._id && "owner"}`}
    >
      <div className="messageContent">
        {content && <p>{content}</p>}
        {attachment && (
          attachment.type.startsWith("image/") ? (
            <button
              className="image-preview-button"
              type="button"
              onClick={() => setShowImage(true)}
            >
              <img
                className="message-attachment-image"
                src={attachment.data}
                alt={attachment.name}
              />
            </button>
          ) : (
            <a
              className="message-attachment-file"
              href={attachment.data}
              download={attachment.name}
            >
              <span aria-hidden="true">DOC</span>
              {attachment.name}
            </a>
          )
        )}
        <span className="messageInfo">
          {formatDistanceToNow(new Date(message.timestamp), {
            addSuffix: true,
          })}
        </span>
      </div>
      {showImage && (
        <ImageModal
          src={attachment.data}
          alt={attachment.name}
          onClose={() => setShowImage(false)}
        />
      )}
    </div>
  );
};

export default Message;
