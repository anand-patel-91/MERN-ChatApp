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
      try {
        const response = await fetch(`${API_URL}/api/userChats/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const json = await response.json();
        if (response.ok) {
          setContacts(json[0]?.chats || []);
        } else if (response.status === 401) {
          logout();
        }
      } catch (error) {
        console.error("Unable to load chats:", error);
      }
    };

    if (user) {
      fetchChats();
      const pollingId = setInterval(fetchChats, 2000);
      return () => clearInterval(pollingId);
    }
  }, [user, logout]);

  const handleSelect = async (chat, chatId) => {
    dispatch({
      type: "CHANGE_USER",
      payload: { name: chat.name, _id: chat.Id, profilePic: chat.profilePic },
    });

    setContacts((currentContacts) =>
      currentContacts?.map((contact) =>
        contact.chatId === chatId ? { ...contact, unreadCount: 0 } : contact
      )
    );

    await fetch(`${API_URL}/api/userChats/${chatId}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  };

  return (
    <div className="chats">
      {contacts &&
        contacts.map((contact) => (
          <div
            className="userChat"
            key={contact.chatId}
            onClick={() => handleSelect(contact.userInfo, contact.chatId)}
          >
            {contact.userInfo.profilePic && (
              <img src={contact.userInfo.profilePic} alt="" />
            )}
            <div className="userChatInfo">
              <span>{contact.userInfo.name}</span>
              <p>{contact.lastMessage}</p>
            </div>
            {contact.unreadCount > 0 && (
              <span className="unread-count">
                {contact.unreadCount > 99 ? "99+" : contact.unreadCount}
              </span>
            )}
          </div>
        ))}
    </div>
  );
};

export default Contacts;
