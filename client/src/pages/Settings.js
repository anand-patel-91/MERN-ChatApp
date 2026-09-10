import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";
import { useMessagesContext } from "../hooks/useMessagesContext";
import { API_URL } from "../config";
import { uploadJson } from "../utils/uploadJson";
import ImageModal from "../components/ImageModal";
import ProgressBar from "../components/ProgressBar";
import { compressImage } from "../utils/compressImage";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showImage, setShowImage] = useState(false);

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    setError("");

    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setError("Choose a PNG, JPEG, WebP, or GIF image under 2 MB");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setProfilePic(compressed.data);
    } catch (error) {
      setError("Unable to prepare this image");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    setUploadProgress(0);

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
      const result = await uploadJson({
        method: "PATCH",
        url: `${API_URL}/api/user/profile`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body,
        onProgress: profilePic ? setUploadProgress : undefined,
      });

      if (!result.ok) {
        setError(result.json.error || "Unable to update profile");
        setLoading(false);
        return;
      }

      const updatedUser = { ...user, ...result.json };
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
                <button className="image-button" type="button" onClick={() => setShowImage(true)}>
                  <img src={profilePic || user.profilePic} alt="Profile preview" />
                </button>
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
          {profilePic && loading && <ProgressBar value={uploadProgress} />}

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
      {showImage && (
        <ImageModal
          src={profilePic || user?.profilePic}
          alt="Profile picture"
          onClose={() => setShowImage(false)}
        />
      )}
    </main>
  );
};

export default Settings;
