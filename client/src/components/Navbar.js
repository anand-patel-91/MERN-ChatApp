import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <div className="navbar">
      <Link to="/">
        <span className="nav-logo">iChat</span>
      </Link>
      <div className="nav-user">
        <span>{user && user.name}</span>
        <button className="logout" onClick={handleClick}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
