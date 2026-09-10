import React from "react";
import Navbar from "./Navbar";
import Contacts from "./Chats";
import Search from "./Search";
import { useChatContext } from "../hooks/useChatContext";

const Sidebar = () => {
  const { chat } = useChatContext();

  return (
    <div className={`sidebar ${chat?._id ? "sidebar-hidden-mobile" : ""}`}>
      <Navbar />
      <div className="chats">
        <Search />
        <Contacts />
      </div>
    </div>
  );
};

export default Sidebar;
