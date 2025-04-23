import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:8070/supplier/");
      setSuppliers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await axios.delete(`http://localhost:8070/supplier/delete/${id}`);
        toast.success("Supplier deleted successfully!");
        fetchSuppliers();
      } catch (error) {
        toast.error("Failed to delete supplier");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Supplier List</h2>
      <Link to="/supplier/add" className="btn btn-primary mb-3">Add Supplier</Link>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Brand</th>
            <th>Actions</th>

          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td>{supplier.name}</td>
              <td>{supplier.email}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.company}</td>
              <td>{supplier.brand}</td>
              <td>
                <Link to={`/supplier/update/${supplier._id}`} className="btn btn-success btn-sm me-2">Edit</Link>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(supplier._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierList;
