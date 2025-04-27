import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleViewDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSupplier(null);
  };

  // Generate PDF report for a single supplier
  const generateSupplierPDF = (supplier) => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text(`Supplier Report: ${supplier.name}`, 105, 15, { align: "center" });
    
    // Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" });
    
    // Supplier Details
    doc.setFontSize(14);
    doc.text("Supplier Information", 14, 30);
    
    const supplierDetails = [
      ["Supplier ID", supplier.supplierId],
      ["Name", supplier.name],
      ["Email", supplier.email || "N/A"],
      ["Phone", supplier.phone || "N/A"],
      ["Company", supplier.company || "N/A"],
      ["Brand", supplier.brand || "N/A"],
      ["Address", supplier.address || "N/A"],
      ["Status", supplier.status || "N/A"],
      ["Created At", new Date(supplier.createdAt).toLocaleDateString()]
    ];
    
    autoTable(doc, {
      startY: 35,
      head: [['Field', 'Value']],
      body: supplierDetails,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 130 }
      }
    });
    
    // Save the PDF
    doc.save(`supplier_report_${supplier.supplierId}.pdf`);
  };

  const generateExcelReport = () => {
    if (suppliers.length === 0) {
      toast.error("No supplier data to generate report!");
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(suppliers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
    XLSX.writeFile(workbook, "Suppliers_Report.xlsx");
    toast.success("Excel report generated successfully!");
  };
  
  const generatePDFReport = () => {
    if (suppliers.length === 0) {
      toast.error("No supplier data to generate report!");
      return;
    }
  
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm"
    });
  
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Supplier Report", 105, 15, { align: "center" });
  
    doc.setFontSize(10);
    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 105, 25, { align: "center" });
  
    const tableData = suppliers.map((supplier) => [
      supplier.name || "-",
      supplier.email || "-",
      supplier.phone || "-",
      supplier.company || "-",
      supplier.brand || "-"
    ]);
  
    const tableWidth = 30 + 40 + 25 + 30 + 25;
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = (pageWidth - tableWidth) / 2;
  
    autoTable(doc, {
      head: [["Name", "Email", "Phone", "Company", "Brand"]],
      body: tableData,
      startY: 30,
      margin: { left: leftMargin },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
        halign: "left"
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
        halign: "center"
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 40 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 25 }
      }
    });
  
    doc.save("Suppliers_Report.pdf");
    toast.success("PDF report generated successfully!");
  };
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid mt-4">
      <h2>Suppliers</h2>

      <div className="d-flex justify-content-end mb-3">
        <div style={{ width: "300px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-primary me-2" onClick={generateExcelReport}>
          ⬇️Generate Excel Report
        </button>
        <button className="btn btn-outline-primary me-2" onClick={generatePDFReport}>
          📄 Generate PDF Report
        </button>
      </div>

      <h2>Supplier List</h2>
      <Link to="/InventoryDashboard/supplier/add" className="btn btn-primary me-2">Add Supplier</Link>
      
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Supplier Name</th>
              <th>Supplier Id</th>
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
                  <td>{supplier.supplierId}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.company}</td>
                  <td>{supplier.brand}</td>
                  <td>
                    <div className="d-flex">
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => handleViewDetails(supplier)}
                      >
                        View
                      </button>
                      <Link 
                        to={`/InventoryDashboard/supplier/update/${supplier._id}`} 
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
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No suppliers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {showModal && selectedSupplier && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Supplier Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Supplier Name:</label>
                      <p>{selectedSupplier.name}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Supplier ID:</label>
                      <p>{selectedSupplier.supplierId}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email:</label>
                      <p>{selectedSupplier.email}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Phone:</label>
                      <p>{selectedSupplier.phone}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Company:</label>
                      <p>{selectedSupplier.company}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Brand:</label>
                      <p>{selectedSupplier.brand}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Address:</label>
                      <p>{selectedSupplier.address}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Status:</label>
                      <p>{selectedSupplier.status}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Created At:</label>
                      <p>{new Date(selectedSupplier.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => generateSupplierPDF(selectedSupplier)}
                >
                  Download Report
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;