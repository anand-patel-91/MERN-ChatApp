import React from "react";
import Navbar from "./Navbar";
import Contacts from "./Contacts";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <div className="chats">
        <Contacts />
      </div>
    </div>
  );
};

export default Sidebar;
