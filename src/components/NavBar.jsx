import { React } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

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
      
      {isLoggedIn && <button className="logout-button" onClick={handleLogout}>Logout</button>}
    </nav>
  );
};

export default Navbar;