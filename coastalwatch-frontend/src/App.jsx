import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ReportForm from './components/ReportForm';
import AlertsMap from './components/AlertsMap';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/alerts" element={<AlertsMap />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;