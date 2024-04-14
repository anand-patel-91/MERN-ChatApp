import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";

const Search = () => {
  const [email, setEmail] = useState("");
  const [chats, setChats] = useState(null);
  const [err, setErr] = useState(null);

  const { user } = useAuthContext();
  const {dispatch} = useChatContext()


  const handleSelect = (chat) => {    
    dispatch({ type: "CHANGE_USER", payload:{email:chat.email, name:chat.name}});
  };

  const handleSearch = async () => {
    setErr(null);
    const response = await fetch("/api/user/search", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      setEmail("");
      setChats(json);
    } else {
      setErr({ message: "No such user found" });
    }
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="email"
          placeholder="Find a user (enter Email)"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          onChange={(e) => setEmail(e.target.value.trimStart())}
          value={email}
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
            <div className="userChatInfo">
              <span>{chat.name}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Search;
