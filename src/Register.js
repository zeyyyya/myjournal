import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./App.css";

function Register({
  name,
  setName,
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  handleRegister,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister({ name, email, username, password });
  };

  return (
    <div className="body-login">
      <div className="login-container">
        <div className="register-form">
          <h2>Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                className="register-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>
            <div className="form-group">
              <input
                className="register-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="form-group">
              <input
                className="register-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="form-group">
              <input
                className="register-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div className="form-group">
              <button type="submit" className="register-button">
                Register
              </button>
            </div>
          </form>
          {/* Link to the Login page */}
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
