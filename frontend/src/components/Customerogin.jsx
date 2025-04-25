import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Customerogin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8070/customers/login",
        {
          phoneNumber,
        }
      );

      if (response.data.success) {
        localStorage.setItem(
          "customer",
          JSON.stringify(response.data.customer)
        );
        // Navigate to the customer's profile using the phone number
        navigate(`/CustomerDashboard/customerprofile/${phoneNumber}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h1>Login with Phone Number</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
