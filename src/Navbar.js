import React from "react";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ logout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to the login page
  };

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Entries
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/journal" className="nav-link">
            Journal Your Thoughts
          </Link>
        </li>
      </ul>
      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
