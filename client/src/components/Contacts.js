import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Contacts = () => {
  const [contacts, setContacts] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch("/api/contacts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        setContacts(json);
      }
    };

    if (user) {
      fetchContacts();
    }
  }, [user]);

  return (
    <div className="chats">
      {contacts && contacts.map((contact) => <div>{contact.name}</div>)}
    </div>
  );
};

export default Contacts;
