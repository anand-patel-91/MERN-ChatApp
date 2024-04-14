import React from "react";
import Navbar from "./Navbar";
import Contacts from "./Chats";
import Search from "./Search";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <div className="chats">
        <Search/>
        <Contacts />
      </div>
    </div>
  );
};

export default Sidebar;
