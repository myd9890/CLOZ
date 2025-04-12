import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedSale, setExpandedSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8070/sale/");
      setSales(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  const toggleSaleDetails = (saleId) => {
    setExpandedSale(expandedSale === saleId ? null : saleId);
  };

  const handleReturn = async (saleId, productId) => {
    if (window.confirm("Are you sure you want to initiate a return for this product?")) {
      try {
        window.location.href = `/sale/return/${saleId}?product=${productId}`;
      } catch (error) {
        toast.error("Failed to initiate return");
        console.error("Return error:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getProductStatus = (product) => {
    if (product.returnedQuantity >= product.quantity) {
      return { text: 'Fully Returned', class: 'bg-danger', canReturn: false };
    }
    if (product.returnedQuantity > 0) {
      return { text: 'Partially Returned', class: 'bg-warning', canReturn: true };
    }
    return { text: 'Sold', class: 'bg-success', canReturn: true };
  };

  return (
    <div className="container mt-4">
      <h2>Sales Records</h2>
      <Link to="/sale/add" className="btn btn-primary mb-3">
        Add New Sale
      </Link>
      
      {loading ? (
        <div className="text-center">Loading sales data...</div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <React.Fragment key={sale._id}>
                <tr>
                  <td>{formatDate(sale.saleDate)}</td>
                  <td>{sale.customer?.name || 'Walk-in Customer'}</td>
                  <td>{sale.products.reduce((sum, p) => sum + p.quantity, 0)}</td>
                  <td>{formatCurrency(sale.totalAmount)}</td>
                  <td>{sale.paymentMethod}</td>
                  <td>
                    <span className={`badge ${
                      sale.status === 'completed' ? 'bg-success' : 
                      sale.status === 'pending' ? 'bg-warning' : 
                      sale.status === 'returned' ? 'bg-secondary' : 'bg-danger'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-info btn-sm"
                      onClick={() => toggleSaleDetails(sale._id)}
                    >
                      {expandedSale === sale._id ? 'Hide' : 'Show'} Details
                    </button>
                  </td>
                </tr>
                {expandedSale === sale._id && (
                  <tr>
                    <td colSpan="7">
                      <div className="p-3 bg-light">
                        <h5>Products Sold</h5>
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Quantity</th>
                              <th>Price</th>
                              <th>Returned</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sale.products.map((product, index) => {
                              const status = getProductStatus(product);
                              const remainingQty = product.quantity - (product.returnedQuantity || 0);
                              
                              return (
                                <tr key={index}>
                                  <td>{product.product?.name || 'Unknown Product'}</td>
                                  <td>{product.quantity}</td>
                                  <td>{formatCurrency(product.quantity * product.product.price)}</td>
                                  <td>{product.returnedQuantity || 0}</td>
                                  <td>
                                    <span className={`badge ${status.class}`}>
                                      {status.text}
                                    </span>
                                  </td>
                                  <td>
                                    {status.canReturn && remainingQty > 0 && sale.status === 'completed' && (
                                      <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => handleReturn(sale._id, product.product._id)}
                                        title={`Return up to ${remainingQty} items`}
                                      >
                                        Return
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalesList;