import React, { useState } from "react";
import { apiCall, API_ENDPOINTS } from "../config/api";

const ReportForm = () => {
  const [hazardType, setHazardType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Location not set");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // In ReportForm.jsx
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Simple validation check
    if (!hazardType || !description) {
      alert("Please fill out all required fields!");
      return; // Stop the function
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const reportData = {
        type: hazardType,
        description: description,
        location: location,
        timestamp: new Date().toISOString(),
      };

      await apiCall(API_ENDPOINTS.reports, {
        method: "POST",
        body: JSON.stringify(reportData),
      });

      setSubmitSuccess(true);
      // Reset form
      setHazardType("");
      setDescription("");
      setLocation("Location not set");
    } catch (error) {
      console.error("Failed to submit report:", error);
      setSubmitError(
        error.message || "Failed to submit report. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Submit an Ocean Hazard Report</h2>

        {submitError && <div className="error-message">{submitError}</div>}

        {submitSuccess && (
          <div className="success-message">Report submitted successfully!</div>
        )}

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
            <button
              type="button"
              className="location-btn"
              onClick={() => setLocation("Geotagged Location Captured!")}
            >
              Get My Current Location
            </button>
            <p className="location-status">{location}</p>
          </div>

          <div className="form-group">
            <label htmlFor="media-upload">Upload Photo/Video</label>
            <input type="file" id="media-upload" />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
