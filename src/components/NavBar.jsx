import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import NightModeToggle from "./NightmodeToggle";

const Navbar = () => {
  const [isNightMode, setIsNightMode] = useState(false);

  const handleToggleTheme = (newMode) => {
    setIsNightMode(newMode);
  };
   const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/account');
  };
  
  const isLoggedIn = !!localStorage.getItem('token');
  
  return (
    <nav>
      <Link to="/">
      <img src="/images/logo.png" alt="Logo" className="nav-logo" />
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/moviecatalog">Movies</Link>
        <Link to="/watchlists">Watchlists</Link>
        <Link to="/account">Account</Link>
      </div>
      <NightModeToggle onToggle={handleToggleTheme} />
      
      {isLoggedIn && <button className="logout-button" onClick={handleLogout}>Logout</button>}
    </nav>
  );
};

export default Navbar;