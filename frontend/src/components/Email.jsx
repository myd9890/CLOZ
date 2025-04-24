import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8070/emails/broadcast-email";

function BroadcastEmail() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API_URL, { subject, message });
      setStatus(response.data.message);
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending broadcast email:", error);
      setStatus("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="broadcast-email">
      <h1>Broadcast Email</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Enter email subject"
            className="input-field"
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Enter email message"
            className="textarea-field"
          ></textarea>
        </div>
        <button type="submit" className="btn">
          Send Email
        </button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default BroadcastEmail;
