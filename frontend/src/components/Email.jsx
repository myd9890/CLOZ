import React, { useState } from "react";
import axios from "axios";
import styles from "./BroadcastEmail.module.css";

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
    <div className={styles.broadcastEmail}>
      <h1 className={styles.header}>Broadcast Email</h1>
      <form onSubmit={handleSubmit} className={styles.emailForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Enter email subject"
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Enter email message"
            className={styles.textareaField}
          ></textarea>
        </div>
        <button type="submit" className={styles.submitBtn}>
          Send Email
        </button>
      </form>
      {status && (
        <p
          className={`${styles.statusMessage} ${
            status.includes("Failed") ? styles.error : ""
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default BroadcastEmail;
