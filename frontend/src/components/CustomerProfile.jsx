import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const CustomerProfile = () => {
  const { id, phone } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    loyaltyPoints: 0,
  });

  // Check for logged-in customer on component mount
  useEffect(() => {
    const loggedInCustomer = JSON.parse(localStorage.getItem("customer"));

    if (!loggedInCustomer) {
      toast.info("Please login with your phone number");
      navigate("/login");
      return;
    }

    // Verify the phone number matches the logged-in customer
    if (phone && loggedInCustomer.phone !== phone) {
      toast.error("Unauthorized access");
      navigate("/login");
      return;
    }

    fetchCustomerData(phone || loggedInCustomer.phone);
  }, [phone]);

  const fetchCustomerData = async (phoneNumber) => {
    try {
      setLoading(true);
      const [customerRes] = await Promise.all([
        axios.get(`http://localhost:8070/customers/profile/${phoneNumber}`),
      ]);

      setCustomer(customerRes.data);
      setPurchases(customerRes.data.purchaseHistory ?? []);

      setFormData({
        name: customerRes.data.name,
        email: customerRes.data.email,
        phone: customerRes.data.phone,
        address: customerRes.data.address || "",
        loyaltyPoints: customerRes.data.loyaltyPoints || 0,
      });
    } catch (error) {
      toast.error("Failed to load customer data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Remove the customer data from local storage
    localStorage.removeItem("customer");

    // Show a success message
    toast.success("Logged out successfully");

    // Navigate to the Customerogin page
    navigate("/CustomerDashboard/logincustomer");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8070/customers/update/${customer._id}`,
        formData
      );

      setCustomer(response.data);
      // Update local storage with new data
      localStorage.setItem("customer", JSON.stringify(response.data));
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your existing functions (formatDate, formatCurrency) remain the same
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading && !customer) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Customer not found</div>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customer Profile</h2>
        <div>
          <button
            className="btn btn-outline-danger me-2"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/customers")}
          >
            Back to Customers
          </button>
        </div>
      </div>

      {/* Rest of your existing UI remains unchanged */}
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Customer Information</h5>
            </div>
            <div className="card-body">
              {editing ? (
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />

                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control mb-2"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />

                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control mb-2"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled // Phone number shouldn't be editable
                  />

                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control mb-2"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                  />

                  <label className="form-label">Loyalty Points</label>
                  <input
                    type="number"
                    className="form-control mb-3"
                    name="loyaltyPoints"
                    value={formData.loyaltyPoints}
                    onChange={handleInputChange}
                    min="0"
                  />

                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-outline-secondary me-2"
                      onClick={() => setEditing(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4>{customer.name}</h4>
                  <p className="text-muted mb-1">
                    <i className="bi bi-envelope me-2"></i>
                    {customer.email || "No email provided"}
                  </p>
                  <p className="text-muted mb-1">
                    <i className="bi bi-telephone me-2"></i>
                    {customer.phone}
                  </p>
                  {customer.address && (
                    <p className="text-muted mb-3">
                      <i className="bi bi-geo-alt me-2"></i>
                      {customer.address}
                    </p>
                  )}
                  <div className="loyalty-badge bg-warning text-dark p-2 rounded d-inline-block">
                    <i className="bi bi-star-fill me-1"></i>
                    {customer.loyaltyPoints || 0} Loyalty Points
                  </div>
                  <div className="mt-3">
                    <button
                      className="btn btn-outline-primary me-2"
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
                    </button>
                    <Link
                      to={`/sale/add/new?customer=${customer._id}`}
                      className="btn btn-primary"
                    >
                      New Sale
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Purchase History</h5>
            </div>
            <div className="card-body">
              {purchases.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-cart-x fs-1 text-muted"></i>
                  <p className="mt-2">No purchases found</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Order #</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((purchase) => (
                        <tr key={purchase._id}>
                          <td>{formatDate(purchase.date)}</td>
                          <td>{purchase._id.substring(0, 8)}...</td>
                          <td>{purchase.items?.length || 0} items</td>
                          <td>{formatCurrency(purchase.amount)}</td>
                          <td>
                            <span
                              className={`badge ${
                                purchase.status === "completed"
                                  ? "bg-success"
                                  : purchase.status === "pending"
                                  ? "bg-warning"
                                  : "bg-danger"
                              }`}
                            >
                              {purchase.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
