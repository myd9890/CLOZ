import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch supplier details
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        console.log("supplier ID:", id);
        const response = await axios.get(`http://localhost:8070/supplier/${id}`);
        console.log("Fetched supplier:", response.data); // Debugging
        setSupplier(response.data);
      } catch (error) {
        console.error("Error fetching supplier:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  // Update supplier details
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Updating supplier with data:", supplier); // Debugging
    try {
      await axios.put(`http://localhost:8070/supplier/update/${id}`, supplier);
      toast.success("Supplier updated successfully!");
      navigate("/InventoryDashboard/supplier/profiles"); // Redirect to supplier list
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("Failed to update supplier");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Edit Supplier</h2>
      <form onSubmit={handleSubmit} className="border p-4 shadow-sm rounded">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input 
            type="text" 
            className="form-control" 
            name="name" 
            value={supplier?.name || ""} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            name="email" 
            value={supplier?.email || ""} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input 
            type="text" 
            className="form-control" 
            name="phone" 
            value={supplier?.phone || ""} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea 
            className="form-control" 
            name="address" 
            value={supplier?.address || ""} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Supplier</button>
      </form>
    </div>
  );
};

export default EditSupplier;