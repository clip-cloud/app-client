import { React, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";


import './navbar.css';

function Navbar() {
  const [navBg, setNavBg] = useState("");
  const location = useLocation();

  // Update nav background class on location change
  useEffect(() => {
    setNavBg(window.location.pathname)
  }, [location]);

  return (
    <div className="navbar">
      <ul>
        <li className={navBg === '/' ? "select" : ""}>
          <Link to="/">Home</Link >
        </li>
        <li className={navBg.match('/gallery') ? "select" : ""}>
          <Link to="gallery">Gallery</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;