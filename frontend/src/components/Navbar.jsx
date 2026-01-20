import { Link } from "react-router-dom";
import React from 'react';

const Navbar = () => {
  return (
    <header className="app-header">
      <h1>🌊 Ocean Hazard Watch</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/report" className="report-button">Report a Hazard</Link>
        <Link to="/alerts">View Alerts</Link>
      </nav>
    </header>
  );
};

export default Navbar;