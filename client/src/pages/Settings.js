import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";
import { useMessagesContext } from "../hooks/useMessagesContext";
import { API_URL } from "../config";

const Settings = () => {
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const { dispatch: chatDispatch } = useChatContext();
  const { dispatch: messagesDispatch } = useMessagesContext();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    setError("");

    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setError("Choose a PNG, JPEG, WebP, or GIF image under 2 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const body = {};
    if (name.trim() !== user.name) body.name = name.trim();
    if (profilePic) body.profilePic = profilePic;
    if (currentPassword || newPassword) {
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }

    if (!Object.keys(body).length) {
      setError("Make a change before saving");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error || "Unable to update profile");
        setLoading(false);
        return;
      }

      const updatedUser = { ...user, ...json };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      dispatch({ type: "LOGIN", payload: updatedUser });
      chatDispatch({ type: "LOGOUT" });
      messagesDispatch({ type: "LOGOUT" });
      navigate("/");
    } catch (requestError) {
      setError("Unable to update profile");
      setLoading(false);
    }
  };

  return (
    <main className="settings-page">
      <section className="settings-card">
        <div className="settings-heading">
          <div>
            <p className="settings-kicker">Account</p>
            <h1>Profile settings</h1>
            <p>Keep your identity and sign-in details up to date.</p>
          </div>
          <Link className="settings-back" to="/">Back to chat</Link>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="settings-photo-row">
            <div className="settings-avatar">
              {(profilePic || user?.profilePic) && (
                <img src={profilePic || user.profilePic} alt="Profile preview" />
              )}
            </div>
            <label className="settings-file-label" htmlFor="settings-profile-pic">
              Change profile picture
              <input
                id="settings-profile-pic"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handlePhotoChange}
              />
            </label>
          </div>

          <label htmlFor="settings-name">Username</label>
          <input
            id="settings-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength="50"
          />

          <div className="settings-section-title">Change password</div>
          <label htmlFor="current-password">Current password</label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
          />
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
          />
          <p className="settings-hint">Leave both password fields blank to keep your current password.</p>

          {error && <p className="settings-message settings-message-error">{error}</p>}
          {success && <p className="settings-message settings-message-success">{success}</p>}
          <button className="settings-save" disabled={loading} type="submit">
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Settings;
