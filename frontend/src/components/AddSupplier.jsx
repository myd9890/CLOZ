import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AddSupplier.css";

const AddSupplier = () => {
  const [supplier, setSupplier] = useState({
    supplierId: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    brand: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    switch (name) {
      case "name":
      case "company":
      case "brand":
        filteredValue = value.replace(/[^a-zA-Z\s-]/g, "");
        break;
      case "supplierId":
        filteredValue = value.replace(/[^a-zA-Z0-9_]/g, "");
        break;
      case "phone":
        filteredValue = value.replace(/\D/g, "").substring(0, 10);
        break;
      default:
        break;
    }

    setSupplier(prev => ({ ...prev, [name]: filteredValue }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};
    const specialCharRegex = /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/;

    if (!supplier.supplierId.trim()) {
      newErrors.supplierId = "Supplier ID is required";
    } else if (specialCharRegex.test(supplier.supplierId)) {
      newErrors.supplierId = "Invalid characters in Supplier ID";
    }

    if (!supplier.name.trim()) {
      newErrors.name = "Name is required";
    } else if (specialCharRegex.test(supplier.name)) {
      newErrors.name = "Invalid characters in Name";
    }

    if (!supplier.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplier.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!supplier.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^07[01245678]\d{7}$/.test(supplier.phone)) {
      newErrors.phone = "Invalid Sri Lankan phone number";
    }

    if (!supplier.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!supplier.company.trim()) {
      newErrors.company = "Company name is required";
    } else if (specialCharRegex.test(supplier.company)) {
      newErrors.company = "Invalid characters in Company name";
    }

    if (!supplier.brand.trim()) {
      newErrors.brand = "Brand is required";
    } else if (specialCharRegex.test(supplier.brand)) {
      newErrors.brand = "Invalid characters in Brand";
    }

    if (supplier.password && supplier.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {return};

    try {
      await axios.post("http://localhost:8070/supplier/add", supplier);
      toast.success("Supplier added successfully");
      setSupplier({
        supplierId: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        company: "",
        brand: "",
        password: "",
      });
      navigate("/InventoryDashboard/supplier/profiles");
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast.error(error.response?.data?.message || "Failed to add supplier");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add Supplier</h2>
      <form onSubmit={handleSubmit} className="supplier-form">
        <div className="mb-3">
          <label className="form-label">Supplier ID</label>
          <input
            type="text"
            name="supplierId"
            value={supplier.supplierId}
            onChange={handleChange}
            className={`form-control ${errors.supplierId ? "is-invalid" : ""}`}
          />
          {errors.supplierId && <div className="invalid-feedback">{errors.supplierId}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={supplier.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={supplier.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            name="phone"
            value={supplier.phone}
            onChange={handleChange}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            maxLength="10"
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            value={supplier.address}
            onChange={handleChange}
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            rows="3"
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Company</label>
          <input
            type="text"
            name="company"
            value={supplier.company}
            onChange={handleChange}
            className={`form-control ${errors.company ? "is-invalid" : ""}`}
          />
          {errors.company && <div className="invalid-feedback">{errors.company}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input
            type="text"
            name="brand"
            value={supplier.brand}
            onChange={handleChange}
            className={`form-control ${errors.brand ? "is-invalid" : ""}`}
          />
          {errors.brand && <div className="invalid-feedback">{errors.brand}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={supplier.password}
            onChange={handleChange}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          Add Supplier
        </button>
      </form>
    </div>
  );
};

export default AddSupplier;