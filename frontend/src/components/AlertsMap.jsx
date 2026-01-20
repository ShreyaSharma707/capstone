import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { apiCall, API_ENDPOINTS } from "../config/api";
import { getSocket } from "../config/socket";
import "leaflet/dist/leaflet.css";

const AlertsMap = () => {
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default map center position (India)
  const defaultPosition = [20.5937, 78.9629];

  // Comprehensive test data
  const testReports = [
    {
      id: 1,
      position: [12.9716, 77.5946], // Bangalore
      type: "High Waves",
      description:
        "Unusually high waves reported near the shore. Wave height estimated at 4-5 meters.",
      severity: "high",
      timestamp: "2024-01-19T10:30:00Z",
    },
    {
      id: 2,
      position: [13.0827, 80.2707], // Chennai
      type: "Floating Debris",
      description:
        "Large shipping container spotted floating approximately 2km from shore.",
      severity: "medium",
      timestamp: "2024-01-19T09:15:00Z",
    },
    {
      id: 3,
      position: [8.5241, 76.9366], // Trivandrum
      type: "Oil Spill",
      description:
        "Small oil slick observed covering approximately 500m² area.",
      severity: "high",
      timestamp: "2024-01-19T08:45:00Z",
    },
    {
      id: 4,
      position: [15.2993, 74.124], // Goa
      type: "Coastal Flooding",
      description:
        "Tidal flooding affecting coastal roads and low-lying areas.",
      severity: "medium",
      timestamp: "2024-01-19T07:20:00Z",
    },
    {
      id: 5,
      position: [19.076, 72.8777], // Mumbai
      type: "High Waves",
      description:
        "Storm surge creating dangerous conditions for small vessels.",
      severity: "high",
      timestamp: "2024-01-19T11:00:00Z",
    },
    {
      id: 6,
      position: [11.9416, 79.8083], // Pondicherry
      type: "Floating Debris",
      description: "Multiple plastic waste clusters and fishing nets observed.",
      severity: "low",
      timestamp: "2024-01-19T06:30:00Z",
    },
    {
      id: 7,
      position: [20.2961, 85.8245], // Bhubaneswar
      type: "Oil Spill",
      description:
        "Major oil spill from tanker accident. Cleanup operations underway.",
      severity: "critical",
      timestamp: "2024-01-19T05:15:00Z",
    },
    {
      id: 8,
      position: [22.5726, 88.3639], // Kolkata
      type: "Coastal Flooding",
      description:
        "Cyclone-induced flooding in coastal villages. Evacuation in progress.",
      severity: "critical",
      timestamp: "2024-01-19T04:45:00Z",
    },
  ];

  const testAlerts = [
    {
      id: 101,
      position: [17.6868, 83.2185], // Visakhapatnam
      type: "Weather Alert",
      description:
        "Severe weather warning: High winds and rough seas expected.",
      severity: "high",
      timestamp: "2024-01-19T12:00:00Z",
    },
    {
      id: 102,
      position: [10.8505, 76.2711], // Kochi
      type: "Navigation Warning",
      description: "Temporary navigation restriction due to naval exercises.",
      severity: "medium",
      timestamp: "2024-01-19T10:00:00Z",
    },
    {
      id: 103,
      position: [13.6288, 79.4192], // Tirupati
      type: "Environmental Alert",
      description:
        "Red tide phenomenon detected. Swimming and fishing not recommended.",
      severity: "high",
      timestamp: "2024-01-19T09:30:00Z",
    },
  ];

  // Helper functions
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "#dc2626";
      case "high":
        return "#ea580c";
      case "medium":
        return "#ca8a04";
      case "low":
        return "#16a34a";
      default:
        return "#6b7280";
    }
  };

  const getSeverityEmoji = (severity) => {
    switch (severity) {
      case "critical":
        return "🚨";
      case "high":
        return "⚠️";
      case "medium":
        return "⚡";
      case "low":
        return "ℹ️";
      default:
        return "📍";
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Load test data
  useEffect(() => {
    console.log("Loading test data...");
    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      setReports(testReports);
      setAlerts(testAlerts);
      setLoading(false);
      console.log(
        "Test data loaded:",
        testReports.length,
        "reports,",
        testAlerts.length,
        "alerts",
      );
    }, 1000);
  }, []);

  // Combine all markers
  const allMarkers = [
    ...reports.map((report) => ({
      id: `report-${report.id}`,
      position: report.position,
      type: report.type,
      description: report.description,
      severity: report.severity,
      timestamp: report.timestamp,
      source: "Report",
    })),
    ...alerts.map((alert) => ({
      id: `alert-${alert.id}`,
      position: alert.position,
      type: alert.type,
      description: alert.description,
      severity: alert.severity,
      timestamp: alert.timestamp,
      source: "Alert",
    })),
  ];

  console.log("Rendering with", allMarkers.length, "markers");

  return (
    <div className="container">
      <div className="map-container">
        <h2>Live Hazard Map</h2>

        {loading && <p>Loading comprehensive test data...</p>}

        {error && (
          <div className="error-message">Error loading data: {error}</div>
        )}

        {!loading && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "rgba(102, 126, 234, 0.1)",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
            }}
          >
            <p style={{ margin: "0.5rem 0", fontWeight: "600" }}>
              📊 Displaying {allMarkers.length} items ({reports.length} reports,{" "}
              {alerts.length} alerts)
            </p>
            <p
              style={{
                margin: "0.5rem 0",
                fontSize: "0.9rem",
                color: "var(--text-secondary-color)",
              }}
            >
              🧪 Comprehensive test data across Indian coastal regions
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                flexWrap: "wrap",
                marginTop: "0.5rem",
                fontSize: "0.85rem",
              }}
            >
              <span>🚨 Critical</span>
              <span>⚠️ High</span>
              <span>⚡ Medium</span>
              <span>ℹ️ Low</span>
            </div>
          </div>
        )}

        {/* Hazard Types Summary */}
        {!loading && allMarkers.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            {Object.entries(
              allMarkers.reduce((acc, marker) => {
                acc[marker.type] = (acc[marker.type] || 0) + 1;
                return acc;
              }, {}),
            ).map(([type, count]) => (
              <div
                key={type}
                style={{
                  background: "white",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  textAlign: "center",
                  boxShadow: "var(--shadow-light)",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: "var(--text-color)",
                    fontSize: "0.9rem",
                  }}
                >
                  {type}
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "var(--primary-color)",
                  }}
                >
                  {count}
                </div>
              </div>
            ))}
          </div>
        )}

        <MapContainer
          center={defaultPosition}
          zoom={6}
          style={{
            height: "600px",
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "var(--shadow-medium)",
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {allMarkers.map((marker) => (
            <Marker key={marker.id} position={marker.position}>
              <Popup maxWidth={300} minWidth={250}>
                <div
                  style={{
                    fontFamily: "inherit",
                    lineHeight: "1.4",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                      paddingBottom: "8px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem", marginRight: "8px" }}>
                      {getSeverityEmoji(marker.severity)}
                    </span>
                    <strong
                      style={{
                        color: getSeverityColor(marker.severity),
                        fontSize: "1.1rem",
                      }}
                    >
                      {marker.type}
                    </strong>
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    <span
                      style={{
                        background:
                          marker.source === "Report" ? "#e0f2fe" : "#f3e8ff",
                        color:
                          marker.source === "Report" ? "#0369a1" : "#7c3aed",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      {marker.source}
                    </span>
                    <span
                      style={{
                        background: getSeverityColor(marker.severity),
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        marginLeft: "6px",
                      }}
                    >
                      {marker.severity}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "8px 0",
                      color: "#374151",
                      fontSize: "0.9rem",
                    }}
                  >
                    {marker.description}
                  </p>

                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "8px",
                      borderTop: "1px solid #e2e8f0",
                      fontSize: "0.8rem",
                      color: "#6b7280",
                    }}
                  >
                    🕒 {formatTimestamp(marker.timestamp)}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default AlertsMap;
