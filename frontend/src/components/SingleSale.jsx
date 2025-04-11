import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SingleSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8070/sale/get/${id}`);
        setSale(response.data);
      } catch (error) {
        toast.error('Failed to load sale data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleData();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'credit_card': return 'Credit Card';
      case 'debit_card': return 'Debit Card';
      case 'mobile_payment': return 'Mobile Payment';
      default: return method;
    }
  };

  if (loading && !sale) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Sale not found</div>
        <button className="btn btn-primary" onClick={() => navigate('/sales')}>
          Back to Sales
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Sale Details</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/sales')}>
          Back to Sales
        </button>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Sale Information</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Sale #{sale._id.substring(0, 8)}</h4>
                <span className={`badge ${getStatusBadge(sale.status)}`}>
                  {sale.status.toUpperCase()}
                </span>
              </div>
              
              <p className="text-muted mb-1">
                <i className="bi bi-calendar me-2"></i>
                {formatDate(sale.date)}
              </p>
              <p className="text-muted mb-3">
                <i className="bi bi-credit-card me-2"></i>
                {getPaymentMethodText(sale.paymentMethod)}
              </p>

              {sale.customer && (
                <div className="customer-info mb-3 p-3 bg-light rounded">
                  <h6>Customer</h6>
                  <p className="mb-1">
                    <i className="bi bi-person me-2"></i>
                    {sale.customer.name}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-telephone me-2"></i>
                    {sale.customer.phone}
                  </p>
                  {sale.customer.email && (
                    <p className="mb-0">
                      <i className="bi bi-envelope me-2"></i>
                      {sale.customer.email}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Products</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.products.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.product?.name || 'Product not found'}
                          {item.product?.name && (
                            <small className="text-muted d-block">SKU: {item.product?._id.substring(0, 8)}</small>
                          )}
                        </td>
                        <td>{formatCurrency(item.priceAtSale)}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.priceAtSale * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Payment Summary</h5>
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-6">
                  <p className="mb-0">Subtotal:</p>
                </div>
                <div className="col-6 text-end">
                  <p className="mb-0">{formatCurrency(sale.totalAmount / (1 + sale.tax/100))}</p>
                </div>
              </div>

              {sale.discount > 0 && (
                <div className="row mb-2">
                  <div className="col-6">
                    <p className="mb-0">Discount:</p>
                  </div>
                  <div className="col-6 text-end">
                    <p className="mb-0">-{formatCurrency(sale.discount)}</p>
                  </div>
                </div>
              )}

              <div className="row mb-2">
                <div className="col-6">
                  <p className="mb-0">Tax ({sale.tax}%):</p>
                </div>
                <div className="col-6 text-end">
                  <p className="mb-0">{formatCurrency(sale.totalAmount - (sale.totalAmount / (1 + sale.tax/100)))}</p>
                </div>
              </div>

              <div className="row mt-3 pt-2 border-top">
                <div className="col-6">
                  <h5 className="mb-0">Total:</h5>
                </div>
                <div className="col-6 text-end">
                  <h5 className="mb-0">{formatCurrency(sale.totalAmount)}</h5>
                </div>
              </div>
            </div>
          </div>

          {sale.notes && (
            <div className="card mt-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Notes</h5>
              </div>
              <div className="card-body">
                <p className="mb-0">{sale.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleSale;