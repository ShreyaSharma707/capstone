import React from 'react';

// The MainContent receives the current 'page' as a prop
const MainContent = ({ page }) => {
  return (
    <main className="main-content">
      {page === 'home' && (
        <div>
          <h2>Home Page</h2>
          <p>Welcome to the home page!</p>
        </div>
      )}
      {page === 'about' && (
        <div>
          <h2>About Us</h2>
          <p>This is the about page with information about our application.</p>
        </div>
      )}
      {page === 'contact' && (
        <div>
          <h2>Contact</h2>
          <p>You can contact us here.</p>
        </div>
      )}
    </main>
  );
};

export default MainContent;