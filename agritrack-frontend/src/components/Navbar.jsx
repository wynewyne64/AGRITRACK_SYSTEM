import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("access_token"));
    };

    const handleScroll = () => {
      const nav = document.querySelector(".transparent-navbar");
      if (!nav) return;
      if (window.scrollY > 100) nav.style.background = "rgba(0, 0, 0, 0.75)";
      else nav.style.background = "rgba(0, 0, 0, 0.35)";
    };

    // listen for other tabs changing the storage
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top transparent-navbar">
      <div className="container">
        <Link className="navbar-brand fw-bold text-light" to="/">AgriTrack</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item"><Link className="nav-link text-light" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link text-light" to="/market">Market</Link></li>

            {isLoggedIn && <li className="nav-item"><Link className="nav-link text-light" to="/dashboard">Dashboard</Link></li>}

            {!isLoggedIn ? (
              <li className="nav-item"><Link className="btn btn-success ms-3" to="/login">Login</Link></li>
            ) : (
              <li className="nav-item"><button className="btn btn-outline-light ms-3" onClick={handleLogout}>Logout</button></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
