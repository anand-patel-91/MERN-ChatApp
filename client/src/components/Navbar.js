import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import ImageModal from "./ImageModal";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [showImage, setShowImage] = useState(false);

  const handleClick = () => {
    logout();
  };

  return (
    <div className="navbar">
      <Link to="/">
        <span className="nav-logo">iChat</span>
      </Link>
      <div className="nav-user">
        {user?.profilePic && (
          <button className="profile-avatar image-button" type="button" onClick={() => setShowImage(true)}>
            <img src={user.profilePic} alt="Profile" />
          </button>
        )}
        <Link className="nav-username" to="/settings">
          {user && user.name}
        </Link>
        <button className="logout" onClick={handleClick}>
          Log Out
        </button>
      </div>
      {showImage && (
        <ImageModal
          src={user.profilePic}
          alt="Profile picture"
          onClose={() => setShowImage(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
