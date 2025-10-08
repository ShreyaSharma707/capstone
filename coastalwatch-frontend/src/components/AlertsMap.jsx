import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mock (fake) data - later this will come from your backend API
const mockReports = [
  { id: 1, position: [12.9716, 77.5946], type: "High Waves", description: "Unusually high waves reported near the shore." },
  { id: 2, position: [13.0827, 80.2707], type: "Floating Debris", description: "Large container spotted floating." },
  { id: 3, position: [8.5241, 76.9366], type: "Oil Spill", description: "Small oil slick observed." },
];

const AlertsMap = () => {
  // Default map center position
  const defaultPosition = [11.5, 78.5];

  return (
    <div className="map-container">
      <h2>Live Hazard Map</h2>
      <p>Displaying mock reports. This will be updated with live data later.</p>
      <MapContainer center={defaultPosition} zoom={6} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {mockReports.map(report => (
          <Marker key={report.id} position={report.position}>
            <Popup>
              <strong>{report.type}</strong><br />
              {report.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default AlertsMap;