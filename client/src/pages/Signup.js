import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import { compressImage } from "../utils/compressImage";
import LoadingSpinner from "../components/LoadingSpinner";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [imageError, setImageError] = useState("");
  const fileInput = useRef(null);
  const { signup, error, loading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(email, name, password, profilePic);
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    setImageError("");

    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setProfilePic("");
      setImageError("Choose an image under 2 MB");
      return;
    }

    try {
      const compressed = await compressImage(file);
      setProfilePic(compressed.data);
    } catch (error) {
      setProfilePic("");
      setImageError("Unable to prepare this image");
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="form-logo">iChat</span>
        <span className="form-title">Signup</span>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            placeholder="John Doe"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value.trimStart())}
          />
          <label htmlFor="profilePic">Profile picture (optional)</label>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            id="profilePic"
            onChange={handlePhotoChange}
          />
          {profilePic && (
            <img className="signup-profile-preview" src={profilePic} alt="Profile preview" />
          )}
          {imageError && <p className="error">{imageError}</p>}
          <label htmlFor="email">Email</label>
          <input
            required
            type="email"
            placeholder="xyz@example.com"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trimStart())}
          />

          <label htmlFor="password">Password</label>
          <input
            required
            type="password"
            placeholder="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trimStart())}
          />

          <button disabled={loading}>
            {loading ? <LoadingSpinner label="Creating account" /> : "Sign up"}
          </button>
          {error && <p className="error">{error}</p>}
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
