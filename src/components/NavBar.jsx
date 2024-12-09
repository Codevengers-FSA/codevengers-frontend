import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", backgroundColor: "#f5f5f5" }}>
      <Link to="/" style={{ margin: "0 10px" }}>Home</Link>
      <Link to="/moviecatalog" style={{ margin: "0 10px" }}>Movies</Link>
      <Link to="/watchlists" style={{ margin: "0 10px" }}>Watchlists</Link>
      <Link to= "/account" style={{margin: "0 10px"}}>Account</Link>


      <input 
        type="text" 
        placeholder="Search..."
      />

    </nav>
  );
}

export default Navbar;