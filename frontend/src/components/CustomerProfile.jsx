import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./CustomerProfile.css";
import { toast } from "react-toastify";

const CustomerProfile = () => {
  const { id, phone } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const response = await axios.get(
        `http://localhost:8070/customers/profile/${phoneNumber}`
      );

      setCustomer(response.data);
      setPurchases(response.data.purchaseHistory ?? []);
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
      currency: "LKR",
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
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Customer Information</h5>
            </div>
            <div className="card-body">
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
                <Link
                  to={`/customerDashboard/sale/add/new?customer=${customer._id}`}
                  className="btn btn-primary"
                >
                  <i className="bi bi-cart-plus me-1"></i> New Sale
                </Link>
              </div>
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
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((purchase) => (
                        <tr key={purchase._id}>
                          <td>{formatDate(purchase.date)}</td>
                          <td>{purchase._id.substring(0, 8)}...</td>
                          <td>{purchase.items?.length || 0} items</td>
                          <td>{formatCurrency(purchase.amount)}</td>
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
