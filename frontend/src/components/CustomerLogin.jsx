import React, { useState } from "react";

const CustomerLogin = ({ setCustomer }) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // Validate
  const validatePhoneNumber = (phone) => {
    const regex = /^(070|071|072|075|077|078)\d{7}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!validatePhoneNumber(phone)) {
      setError(
        "Please enter a valid 10-digit Sri Lankan mobile number starting with 070, 071, 072, 075, 077, or 078."
      );
      return;
    }

    setError("");

    try {
      const response = await fetch(
        "http://localhost:8070/api/customers/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCustomer(data.customer); // Update the customer state
      } else {
        setError(
          data.message || "Login failed. Please check your phone number."
        );
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Customer Login</h2>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default CustomerLogin;
