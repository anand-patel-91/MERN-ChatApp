import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { signup, error, loading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(email, name, password);
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

          <button disabled={loading}>Sign up</button>
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
