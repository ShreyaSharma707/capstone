import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ReportForm from "./components/ReportForm";
import AlertsMap from "./components/AlertsMap";
import { initializeSocket, disconnectSocket } from "./config/socket";
import "./App.css";

function App() {
  useEffect(() => {
    // Initialize socket connection when app starts
    const socket = initializeSocket();

    // Set up any global socket event listeners here
    socket.on("alert", (data) => {
      console.log("New alert received:", data);
      // You could show a notification or update global state here
    });

    socket.on("report_update", (data) => {
      console.log("Report update received:", data);
      // Handle real-time report updates
    });

    // Cleanup function to disconnect socket when app unmounts
    return () => {
      disconnectSocket();
    };
  }, []);

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
