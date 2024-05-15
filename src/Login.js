// Login.js

import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Login({ handleLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    handleLogin(username, password);
  };

  return (
    <div className="login-bg">
      <div className="body-login">
        <div className="login-container">
          <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                />
              </div>
              <div className="form-group">
                <button type="submit" className="login-button">
                  Login
                </button>
              </div>
            </form>
            <p>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
