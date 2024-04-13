import React, { useState } from "react";
import { useMessagesContext } from "../hooks/useMessagesContext";
import { useAuthContext } from "../hooks/useAuthContext";

const Input = () => {
  const [message, setMessage] = useState("");
  const { dispatch } = useMessagesContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!message.length) return;

    if (!user) {
      return;
    }

    const response = await fetch("api/messages", {
      method: "POST",
      body: JSON.stringify({ content: message.trimEnd() }),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      setMessage("");
      dispatch({ type: "SEND_MESSAGE", payload: json });
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value.trimStart())}
        value={message}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleClick();
        }}
        placeholder="Hi.."
      />
      <div className="send">
        <button onClick={handleClick}>Send</button>
      </div>
    </div>
  );
};

export default Input;
