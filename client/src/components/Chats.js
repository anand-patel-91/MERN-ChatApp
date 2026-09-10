import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";
import { useLogout } from "../hooks/useLogout";
import { API_URL } from "../config";
import ImageModal from "./ImageModal";

const Contacts = () => {
  const [contacts, setContacts] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const contactsFingerprint = useRef("");
  const { user } = useAuthContext();
  const { chat: activeChat, dispatch } = useChatContext();
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
          const nextContacts = (json[0]?.chats || []).sort(
            (firstChat, secondChat) =>
              new Date(secondChat.lastMessageAt || 0) -
              new Date(firstChat.lastMessageAt || 0)
          );
          const nextFingerprint = nextContacts
            .map(
              (contact) =>
                `${contact.chatId}:${contact.lastMessageAt || ""}:${contact.unreadCount || 0}:${contact.userInfo.name}`
            )
            .join("|");

          if (nextFingerprint !== contactsFingerprint.current) {
            contactsFingerprint.current = nextFingerprint;
            setContacts(nextContacts);
          }

          const activeContact = nextContacts.find(
            (contact) => contact.userInfo.Id === activeChat?._id
          );
          if (activeContact && activeContact.userInfo.name !== activeChat?.name) {
            dispatch({
              type: "UPDATE_CHAT_USER",
              payload: {
                name: activeContact.userInfo.name,
              },
            });
          }
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
  }, [user, logout, activeChat?._id, activeChat?.name, dispatch]);

  const handleSelect = async (selectedContact, chatId) => {
    const isSameChat = activeChat?._id === selectedContact.Id;

    if (!isSameChat) {
      dispatch({
        type: "CHANGE_USER",
        payload: { name: selectedContact.name, _id: selectedContact.Id },
      });

      fetch(`${API_URL}/api/user/profile/${selectedContact.Id}`, {
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
    } else {
      dispatch({ type: "CLEAR_SEARCH" });
    }

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
            <button
              className="image-button contact-avatar-button"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedImage(
                  `${API_URL}/api/user/profile/${contact.userInfo.Id}/picture`
                );
              }}
            >
              <span className="contact-initial">
                {contact.userInfo.name.charAt(0).toUpperCase()}
              </span>
              <img
                src={`${API_URL}/api/user/profile/${contact.userInfo.Id}/picture`}
                alt=""
                loading="eager"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </button>
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
      {selectedImage && (
        <ImageModal
          src={selectedImage}
          alt="Contact profile picture"
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default Contacts;
