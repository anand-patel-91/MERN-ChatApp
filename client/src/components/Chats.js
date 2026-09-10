import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";
import { useLogout } from "../hooks/useLogout";
import { API_URL } from "../config";

const Contacts = () => {
  const [contacts, setContacts] = useState(null);
  const { user } = useAuthContext();
  const { dispatch } = useChatContext();
  const {logout} = useLogout()

  useEffect(() => {
    const fetchChats = async () => {
      const response = await fetch(`${API_URL}/api/userChats/${user._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        setContacts(json[0]?.chats);
      }else{
        if(json.error === 'Token expired'){
          logout()
        }
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user, logout]);

  const handleSelect = (chat) => {
    dispatch({ type: "CHANGE_USER", payload:{name:chat.name, _id:chat.Id} });
  };

  return (
    <div className="chats">
      {contacts &&
        contacts.map((contact) => (
          <div
            className="userChat"
            key={contact.chatId}
            onClick={() => handleSelect(contact.userInfo)}
          >
            {contact.userInfo.profilePic && (
              <img src={contact.userInfo.profilePic} alt="" />
            )}
            <div className="userChatInfo">
              <span>{contact.userInfo.name}</span>
              <p>{contact.lastMessage}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Contacts;
