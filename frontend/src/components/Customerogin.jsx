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
        navigate(`/CustomerDashboard/customerprofile/${phoneNumber}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numeric input

    // Enforce starting with "07"
    if (value.length === 1 && value !== "0") {
      value = "";
    } else if (value.length === 2 && value !== "07") {
      value = "0";
    } else if (value.length > 2) {
      const prefix = value.substring(0, 3);
      const allowedPrefixes = [
        "070",
        "071",
        "072",
        "074",
        "075",
        "076",
        "077",
        "078",
      ];
      if (!allowedPrefixes.includes(prefix)) {
        value = value.slice(0, 2);
      }
    }

    // Limit to 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setPhoneNumber(value);
  };

  return (
    <div className="login-page">
      <div
        className="card p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <form onSubmit={handleLogin}>
          <h1 className="text-center mb-4" style={{ fontSize: "2.0rem" }}>
            Customer Login
          </h1>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className="form-control"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            style={{
              backgroundColor: "#3498db",
              borderColor: "#3498db",
              color: "white",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
