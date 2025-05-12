import { useState } from "react";
import axios from "axios";
import "./RegistationForm.css";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8070/api/customers/register";

function RegisterCustomer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mobileCodes = ["070", "071", "072", "074", "075", "076", "077", "078"];

  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", email: "", phone: "" };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (!/^[A-Za-z\s]{3,50}$/.test(formData.name)) {
      newErrors.name = "Name must be 3-50 letters, no numbers or symbols";
      isValid = false;
    }

    // Email validation (updated to allow normal email formats)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email =
        "Enter a valid email (letters, digits, ., _, %, +, -, @domain, .tld)";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
      isValid = false;
    } else if (!mobileCodes.includes(formData.phone.substring(0, 3))) {
      newErrors.phone = "Invalid Sri Lankan mobile prefix";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const filteredValue = value.replace(/[^A-Za-z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    } else if (name === "email") {
      setFormData((prev) => ({ ...prev, [name]: value.toLowerCase() }));
    } else if (name === "phone") {
      let filteredValue = value.replace(/[^0-9]/g, "");

      // Enforce starting with "07"
      if (filteredValue.length === 1 && filteredValue !== "0") {
        filteredValue = "";
      } else if (filteredValue.length === 2 && filteredValue !== "07") {
        filteredValue = "0";
      } else if (filteredValue.length > 2) {
        const prefix = filteredValue.substring(0, 3);
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
          filteredValue = filteredValue.slice(0, 2);
        }
      }

      setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(API_URL, formData);
      setFormData({ name: "", email: "", phone: "" });
      toast.success("Registration successful!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
        { position: "top-center" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <header className="registration-header">
          <h1>Customer Registration</h1>
        </header>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
              placeholder=""
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              placeholder=""
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <div className="phone-input">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "input-error" : ""}
                placeholder=""
                maxLength="10"
              />
            </div>
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              "Register Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterCustomer;
