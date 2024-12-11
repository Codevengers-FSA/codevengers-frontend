import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
    <Link to="/">Home</Link>
    <Link to="/moviecatalog">Movies</Link>
    <Link to="/watchlists">Watchlists</Link>
    <Link to="/account">Account</Link>
  </nav>
  );
}

export default Navbar;