import React, { useState } from "react";
import { useMessagesContext } from "../hooks/useMessagesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";
import { API_URL } from "../config";
import { uploadJson } from "../utils/uploadJson";
import { compressImage } from "../utils/compressImage";
import ProgressBar from "./ProgressBar";

const Input = () => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { dispatch } = useMessagesContext();
  const { user } = useAuthContext();
  const { chat, chatId } = useChatContext();

  const saveToMessages = async (text, selectedAttachment) => {
    setUploading(Boolean(selectedAttachment));
    setUploadProgress(0);
    try {
      const result = await uploadJson({
        method: "POST",
        url: `${API_URL}/api/messages/`,
        body: {
          chatId,
          content: text,
          attachment: selectedAttachment,
        },
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        onProgress: selectedAttachment ? setUploadProgress : undefined,
      });

      if (result.ok) {
        setMessage("");
        setAttachment(null);
        setAttachmentError("");
        dispatch({ type: "SEND_MESSAGE", payload: result.json });
      } else {
        setAttachmentError(result.json.error || "Unable to send attachment");
      }
    } catch (error) {
      setAttachmentError("Unable to send attachment");
    } finally {
      setUploading(false);
    }
  };

  const saveToUserChats = async (text) => {
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      };
      await Promise.all([
        fetch(`${API_URL}/api/userChats`, {
          method: "POST",
          body: JSON.stringify({ chatId, content: text, Id: user._id, user: chat }),
          headers,
        }),
        fetch(`${API_URL}/api/userChats`, {
          method: "POST",
          body: JSON.stringify({
            chatId,
            content: text,
            Id: chat._id,
            user: { name: user.name, _id: user._id },
          }),
          headers,
        }),
      ]);
    } catch (error) {
      setAttachmentError("Message sent, but chat list could not be updated");
    }
  };

  const handleClick = async () => {
    const text = message.trim();
    if (!text.length && !attachment) return;

    if (!user) {
      return;
    }

    saveToMessages(text, attachment);

    saveToUserChats(attachment ? `Attachment: ${attachment.name}` : text);
  };

  const handleAttachmentChange = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    setAttachmentError("");

    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setAttachment(null);
      setAttachmentError("Files must be 5 MB or smaller");
      return;
    }

    try {
      if (file.type.startsWith("image/")) {
        setAttachment(await compressImage(file));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setAttachment({
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setAttachment(null);
      setAttachmentError("Unable to prepare this image");
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleClick();
        }}
        placeholder="Hi..."
        disabled={!chatId}
      />
      <label className="attachment-button" title="Attach an image or document">
        <span aria-hidden="true">+</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,text/plain,.doc,.docx,.xls,.xlsx"
          onChange={handleAttachmentChange}
          disabled={!chatId}
          hidden
        />
      </label>
      {attachment && (
        <span className="attachment-selected">
          <span className="attachment-name">{attachment.name}</span>
          <button
            className="attachment-remove"
            type="button"
            onClick={() => {
              setAttachment(null);
              setAttachmentError("");
            }}
            title="Remove attachment"
            aria-label="Remove attachment"
          >
            &times;
          </button>
        </span>
      )}
      {attachmentError && <span className="attachment-error">{attachmentError}</span>}
      {uploading && <ProgressBar value={uploadProgress} />}
      <div className="send">
        <button onClick={handleClick} disabled={!chatId || uploading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
