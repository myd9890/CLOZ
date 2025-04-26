import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = "http://localhost:8070/api/customers";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editData, setEditData] = useState(null);
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState("all");
  const [reportLoading, setReportLoading] = useState(false);

  const mobileCodes = ["070", "071", "072", "075", "077", "078"];

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.phone.includes(searchTerm) ||
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/read`);
      const customersData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setCustomers(customersData);
      setFilteredCustomers(customersData);
      setError(null);
    } catch (error) {
      setError("Failed to fetch customers. Please try again.");
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/delete/${id}`);
        setCustomers(customers.filter((customer) => customer._id !== id));
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const handleEdit = (customer) => {
    setEditData(customer);
    setErrors({ name: "", email: "", phone: "" });
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", email: "", phone: "" };

    const namePattern = /^[A-Za-z\s]{3,50}$/;
    if (!namePattern.test(editData.name)) {
      newErrors.name =
        "Name must contain only letters and spaces (3-50 characters).";
      isValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(editData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    if (!/^\d{10}$/.test(editData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    } else {
      const prefix = editData.phone.substring(0, 3);
      if (!mobileCodes.includes(prefix)) {
        newErrors.phone = "Invalid mobile number prefix for Sri Lanka.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`${API_URL}/update/${editData._id}`, editData);
      setEditData(null);
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const generateReport = async () => {
    setReportLoading(true);
    try {
      let reportData = [...customers];

      if (reportType === "withPurchases") {
        reportData = reportData.filter((c) => c.purchaseHistory?.length > 0);
      } else if (reportType === "highValue") {
        reportData = reportData.filter((c) => c.loyaltyPoints > 1000);
      }

      // Initialize PDF document
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text("Customer Report", 14, 15);

      // Add report metadata
      doc.setFontSize(12);
      const reportTitle =
        reportType === "all"
          ? "All Customers"
          : reportType === "withPurchases"
          ? "Customers with Purchases"
          : "High Value Customers";
      doc.text(`Report Type: ${reportTitle}`, 14, 25);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Prepare table data
      const tableData = reportData.map((customer) => {
        const totalPurchases = customer.purchaseHistory?.length || 0;
        const totalSpent =
          customer.purchaseHistory?.reduce(
            (sum, p) => sum + (p.amount || 0),
            0
          ) || 0;

        return [
          customer.name,
          customer.email,
          customer.phone,
          new Date(customer.registrationDate).toLocaleDateString(),
          customer.loyaltyPoints,
          totalPurchases,
          `Rs. ${totalSpent.toFixed(2)}`,
        ];
      });

      // Add table using the autoTable function directly
      autoTable(doc, {
        head: [
          [
            "Name",
            "Email",
            "Phone",
            "Registration Date",
            "Loyalty Points",
            "Purchases",
            "Total Spent",
          ],
        ],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // Save the PDF
      doc.save(
        `customer_report_${reportType}_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );
    } catch (error) {
      console.error("Error generating report:", error);
      setError("Failed to generate report. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <h1>Customer Management</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="all">All Customers</option>
            <option value="withPurchases">Customers with Purchases</option>
            <option value="highValue">High Value Customers</option>
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={generateReport}
            disabled={reportLoading}
          >
            {reportLoading ? "Generating..." : "Export PDF"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p>Loading customers...</p>
        </div>
      ) : editData ? (
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title">Edit Customer</h2>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name && "is-invalid"}`}
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email && "is-invalid"}`}
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className={`form-control ${errors.phone && "is-invalid"}`}
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>
            <button className="btn btn-success me-2" onClick={handleUpdate}>
              Update
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setEditData(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registration Date</th>
                <th>Loyalty Points</th>
                <th>Purchase History</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    {new Date(customer.registrationDate).toLocaleDateString()}
                  </td>
                  <td>{customer.loyaltyPoints}</td>
                  <td>
                    {customer.purchaseHistory?.length > 0 ? (
                      <details>
                        <summary>
                          View Purchases ({customer.purchaseHistory.length})
                        </summary>
                        <ul>
                          {customer.purchaseHistory.map((p, index) => (
                            <li key={index}>
                              {p.date} - Rs. {p.amount}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      "No Purchases"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(customer._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomerList;
