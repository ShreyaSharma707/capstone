import React from 'react';
// 1. Import the Link component
import { Link } from 'react-router-dom';

// 2. Remove { setPage } from the props
const Home = () => {
  return (
    <div className="home-container">
      <section className="intro">
        <h2>Integrated Hazard Reporting Platform</h2>
        <p>
          Empowering citizens to report ocean hazards, view real-time alerts, and
          support coastal safety.
        </p>
      </section>

      <section className="cards">
        <div className="card">
          <h3>Submit a Hazard Report</h3>
          <p>
            Share details about oil spills, floating debris, or unsafe
            conditions you observe.
          </p>
          {/* 3. & 4. Change button to Link and onClick to 'to' */}
          <Link to="/report" className="btn">
            Report Now
          </Link>
        </div>
        <div className="card">
          <h3>View Live Alerts</h3>
          <p>
            Get real-time updates on ocean conditions and safety warnings on an
            interactive map.
          </p>
          {/* 3. & 4. Change button to Link and onClick to 'to' */}
          <Link to="/alerts" className="btn">
            View Alerts Map
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;