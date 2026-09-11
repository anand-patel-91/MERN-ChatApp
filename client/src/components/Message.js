import React, { useEffect, useRef, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMessagesContext } from "../hooks/useMessagesContext";
import { useChatContext } from "../hooks/useChatContext";
import { API_URL } from "../config";
import ImageModal from "./ImageModal";

const Message = ({ message }) => {
  const { content, attachment } = message;
  const ref = useRef();
  const { user } = useAuthContext();
  const { dispatch } = useMessagesContext();
  const { chatId } = useChatContext();
  const [showImage, setShowImage] = useState(false);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editText, setEditText] = useState(content);
  const [error, setError] = useState("");
  const isOwner = message.senderId === user._id;

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeMenu = (event) => {
      if (!event.target.closest(`[data-message-id="${message._id}"]`)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [menuOpen, message._id]);

  const handleEdit = async () => {
    if (!editText.trim() || editText.length > 2000) return;
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/messages/${message._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ chatId, content: editText }),
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(json.error || "Unable to edit message");
        return;
      }

      dispatch({ type: "UPDATE_MESSAGE", payload: json });
      setEditing(false);
    } catch (requestError) {
      setError("Unable to connect to the server");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this message?")) return;
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/messages/${message._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        setError(json.error || "Unable to delete message");
        return;
      }

      dispatch({ type: "DELETE_MESSAGE", payload: message._id });
    } catch (requestError) {
      setError("Unable to connect to the server");
    }
  };

  return (
    <div
      ref={ref}
      className={`message ${isOwner && "owner"}`}
      data-message-id={message._id}
    >
      {isOwner && (
        <div className="message-menu-wrap">
          <button
            className="message-menu-trigger"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Message options"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
          {menuOpen && (
            <div className="message-menu" role="menu">
              {content && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setEditing(true);
                  }}
                >
                  Edit
                </button>
              )}
              <button type="button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      )}
      <div className="messageContent">
        {editing ? (
          <div className="message-edit-form">
            <textarea
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              maxLength="2000"
              autoFocus
            />
            <div>
              <button type="button" onClick={handleEdit}>Save</button>
              <button type="button" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : content ? <p>{content}</p> : null}
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
        {error && <small className="message-error">{error}</small>}
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
