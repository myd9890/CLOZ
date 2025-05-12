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

  const mobileCodes = ["070", "071", "072", "074", "075", "076", "077", "078"];

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

      const doc = new jsPDF();

      // Set font size and color for the shop name
      doc.setFontSize(24); // Larger font size for the shop name
      doc.setTextColor("#3498db"); // Set text color to #3498db
      doc.setFont("helvetica", "bold"); // Set font to bold
      doc.text("CLOZ", doc.internal.pageSize.getWidth() / 2, 20, {
        align: "center", // Center the text horizontally
      });

      // Add the report title below the shop name
      doc.setFontSize(18);
      doc.setTextColor("#000000"); // Reset text color to black
      doc.setFont("helvetica", "normal"); // Reset font to normal
      doc.text("Customer Report", doc.internal.pageSize.getWidth() / 2, 30, {
        align: "center",
      });

      // Add the report type and generation date
      doc.setFontSize(12);
      doc.text(`Report Type: ${reportType}`, 14, 40);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);

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

      // Add table to the PDF
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
        startY: 50,
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

  const handleSearchChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numeric input

    // Enforce starting with "07"
    if (value.length === 1 && value !== "0") {
      value = "";
    } else if (value.length === 2 && value !== "07") {
      value = "0";
    } else if (value.length > 2) {
      const prefix = value.substring(0, 3);
      if (!mobileCodes.includes(prefix)) {
        value = value.slice(0, 2);
      }
    }

    // Limit to 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setSearchTerm(value);
  };

  return (
    <div className="container-fluid px-0">
      <div className="px-3">
        <h1 style={{ fontSize: "2.0rem", fontWeight: "bold" }}>
          Customer Management
        </h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by phone"
              value={searchTerm}
              onChange={handleSearchChange}
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
              style={{
                backgroundColor: "#3498db",
                borderColor: "#3498db",
                color: "white",
              }}
            >
              {reportLoading ? "Generating..." : "Export PDF"}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p>Loading customers...</p>
        </div>
      ) : editData ? (
        <div className="card mb-4 mx-3">
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
        <div className="table-responsive px-3">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registration Date</th>
                <th>Loyalty Points</th>
                <th>Purchase Amount</th>
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
                    {customer.registrationDate
                      ? new Date(customer.registrationDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{customer.loyaltyPoints || 0}</td>
                  <td>{customer.purchaseHistory?.length || 0} purchases</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          padding: "5px",
                          borderRadius: "5px",
                          color: "#f7b731",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                        onClick={() => handleEdit(customer)}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 0 0 2px #f7b731")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                      >
                        ✏️
                      </button>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          padding: "5px",
                          borderRadius: "5px",
                          color: "#eb3b5a",
                          cursor: "pointer",
                          fontSize: "16px",
                        }}
                        onClick={() => handleDelete(customer._id)}
                        onFocus={(e) =>
                          (e.target.style.boxShadow = "0 0 0 2px #eb3b5a")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomerList;
