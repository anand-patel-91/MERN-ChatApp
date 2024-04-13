import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="form-logo">iChat</span>
        <span className="form-title">Login</span>
        <form onSubmit={handleSubmit}>
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

          <button disabled={loading}>Log in</button>
          {error && <p className="error">{error}</p>}
        </form>

        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
