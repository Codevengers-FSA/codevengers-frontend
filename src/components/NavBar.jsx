import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import NightModeToggle from "./NightmodeToggle";

const Navbar = () => {
  const [isNightMode, setIsNightMode] = useState(false);

  const handleToggleTheme = (newMode) => {
    setIsNightMode(newMode);
  };
  return (
    <nav>
    <Link to="/">Home</Link>
    <Link to="/moviecatalog">Movies</Link>
    <Link to="/watchlists">Watchlists</Link>
    <Link to="/account">Account</Link>

    <NightModeToggle onToggle={handleToggleTheme} />
  </nav>
  );
}

export default Navbar;