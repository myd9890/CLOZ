import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8070/sale/");
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (saleId) => {
    if (window.confirm("Are you sure you want to process this return?")) {
      try {
        // First get the sale details
        const saleResponse = await axios.get(`http://localhost:8070/sale/${saleId}`);
        const sale = saleResponse.data;

        // Prepare return data (you might want to modify this based on your requirements)
        const returnData = {
          saleId: sale._id,
          products: sale.products.map(product => ({
            productId: product.product._id,
            quantity: product.quantity,
            priceAtSale: product.priceAtSale
          })),
          reason: "Customer return" // You might want to make this configurable
        };

        // Call your backend API to process the return
        await axios.post("http://localhost:8070/sale/return", returnData);
        
        toast.success("Return processed successfully!");
        fetchSales(); // Refresh the sales list
      } catch (error) {
        console.error("Error processing return:", error);
        toast.error("Failed to process return");
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
              <tr key={sale._id}>
                <td>{formatDate(sale.saleDate)}</td>
                <td>{sale.customer?.name || 'Walk-in Customer'}</td>
                <td>{sale.products.length}</td>
                <td>{formatCurrency(sale.totalAmount)}</td>
                <td>{sale.paymentMethod}</td>
                <td>
                  <span className={`badge ${
                    sale.status === 'completed' ? 'bg-success' : 
                    sale.status === 'pending' ? 'bg-warning' : 'bg-danger'
                  }`}>
                    {sale.status}
                  </span>
                </td>
                <td>
                  <Link 
                    to={`/sale/details/${sale._id}`} 
                    className="btn btn-info btn-sm me-2"
                  >
                    Details
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleReturn(sale._id)}
                    disabled={sale.status === 'returned'}
                  >
                    {sale.status === 'returned' ? 'Returned' : 'Return'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalesList;