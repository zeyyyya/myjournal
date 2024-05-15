import React from "react";
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
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/journal" className="nav-link">
            Journal
          </Link>
        </li>
        <li className="nav-item">
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
