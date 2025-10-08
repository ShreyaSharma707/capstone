import React, { useState } from 'react';

const ReportForm = () => {
  const [hazardType, setHazardType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Location not set');

  // In ReportForm.jsx
const handleSubmit = (event) => {
  event.preventDefault();
  // Simple validation check
  if (!hazardType || !description) {
    alert('Please fill out all required fields!');
    return; // Stop the function
  }
  alert(`Report Submitted!`);
};

  return (
    <div className="form-container">
      <h2>Submit an Ocean Hazard Report</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="hazard-type">Type of Hazard</label>
          <select
            id="hazard-type"
            value={hazardType}
            onChange={(e) => setHazardType(e.target.value)}
            required
          >
            <option value="">-- Select a type --</option>
            <option value="Oil Spill">Oil Spill</option>
            <option value="Floating Debris">Floating Debris</option>
            <option value="High Waves">High Waves</option>
            <option value="Coastal Flooding">Coastal Flooding</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="5"
            placeholder="Provide details about the hazard..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Location</label>
          <button type="button" className="location-btn" onClick={() => setLocation('Geotagged Location Captured!')}>
            Get My Current Location
          </button>
          <p className="location-status">{location}</p>
        </div>

        <div className="form-group">
          <label htmlFor="media-upload">Upload Photo/Video</label>
          <input type="file" id="media-upload" />
        </div>

        <button type="submit" className="submit-btn">Submit Report</button>
      </form>
    </div>
  );
};

export default ReportForm;