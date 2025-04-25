import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:8070/supplier/");
      setSuppliers(response.data);
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

  const generateExcelReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(suppliers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
    XLSX.writeFile(workbook, "Suppliers_Report.xlsx");
    toast.success("Excel report generated successfully!");
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.text("Supplier Report", 14, 15);
    
    // Add date
    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 14, 25);
    
    // Add table
    doc.autoTable({
      head: [["Name", "Email", "Phone", "Company", "Brand"]],
      body: suppliers.map(supplier => [
        supplier.name,
        supplier.email,
        supplier.phone,
        supplier.company,
        supplier.brand
      ]),
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    doc.save("Suppliers_Report.pdf");
    toast.success("PDF report generated successfully!");
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Supplier List</h2>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <Link to="/supplier/add" className="btn btn-primary me-2">Add Supplier</Link>
          <button className="btn btn-success me-2" onClick={generateExcelReport}>
            Generate Excel Report
          </button>
          <button className="btn btn-danger" onClick={generatePDFReport}>
            Generate PDF Report
          </button>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
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
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.company}</td>
                  <td>{supplier.brand}</td>
                  <td>
                    <Link 
                      to={`/supplier/update/${supplier._id}`} 
                      className="btn btn-success btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDelete(supplier._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No suppliers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierList;