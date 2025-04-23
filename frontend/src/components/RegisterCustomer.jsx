import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8070/api/customers/register";

function RegisterCustomer() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });

  const mobileCodes = ["070", "071", "072", "075", "077", "078"];

  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", email: "", phone: "" };

    // Name validation (only letters and spaces, no symbols)
    const namePattern = /^[A-Za-z\s]{3,50}$/;
    if (!namePattern.test(formData.name)) {
      newErrors.name =
        "Name can only contain letters and spaces (3-50 chars). No symbols allowed.";
      isValid = false;
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    // Phone number validation (Sri Lanka Mobile Numbers)
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    } else {
      const prefix = formData.phone.substring(0, 3);
      if (!mobileCodes.includes(prefix)) {
        newErrors.phone = "Invalid mobile number prefix for Sri Lanka.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post(API_URL, formData);
      setFormData({ name: "", email: "", phone: "" });
      setErrors({ name: "", email: "", phone: "" });
      alert("Customer registered successfully!");
    } catch (error) {
      console.error("Error registering customer:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Register Customer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterCustomer;
