import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";
import { API_URL } from "../config";

const Search = () => {
  const [name, setName] = useState("");
  const [chats, setChats] = useState(null);
  const [err, setErr] = useState(null);

  const { user } = useAuthContext();
  const { dispatch, searchVersion } = useChatContext();

  useEffect(() => {
    setName("");
    setChats(null);
    setErr(null);
  }, [searchVersion]);

  const handleSelect = async (chat) => {
    setName("");
    setChats(null);
    setErr(null);

    dispatch({
      type: "CHANGE_USER",
      payload: { _id: chat._id, name: chat.name },
    });

    fetch(`${API_URL}/api/user/profile/${chat._id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((profile) => {
        if (profile) {
          dispatch({
            type: "UPDATE_CHAT_USER",
            payload: { name: profile.name, profilePic: profile.profilePic },
          });
        }
      })
      .catch(() => {});
  };

  const handleSearch = async () => {
    setErr(null);
    const response = await fetch(`${API_URL}/api/user/search`, {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      setName("");
      setChats(json);
    } else {
      setErr({ message: "No such user found" });
    }
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          onChange={(e) => setName(e.target.value.trimStart())}
          value={name}
        />
      </div>
      {err && <span>{err.message}</span>}
      {chats &&
        chats.map((chat) => (
          <div
            className="userChat"
            onClick={() => handleSelect(chat)}
            key={chat._id}
          >
            <div className="contact-initial">{chat.name.charAt(0).toUpperCase()}</div>
            <div className="userChatInfo">
              <span>{chat.name}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Search;
