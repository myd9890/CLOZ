import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedSale, setExpandedSale] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  const generatePDF = () => {
    if (window.confirm("Do you want to download the sales report as a PDF?")) {
      const input = document.getElementById("sales-table");
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 190; // Adjust width to fit the page
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("sales_report.pdf");
        toast.success("Sales report downloaded successfully!");
      });
    }
  };

  // Filter sales based on the search query
  const filteredSales = sales.filter((sale) =>
    sale.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteSale = async (saleId) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        await axios.delete(`http://localhost:8070/sale/${saleId}`);
        toast.success("Sale deleted successfully!");
        // Update the sales state to remove the deleted sale
        setSales(sales.filter((sale) => sale._id !== saleId));
      } catch (error) {
        console.error("Error deleting sale:", error);
        toast.error("Failed to delete sale");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Sales Records</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by status (e.g., completed, pending)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={generatePDF}>
        Download PDF
      </button>
      {loading ? (
        <div className="text-center">Loading sales data...</div>
      ) : (
        <table
          id="sales-table"
          className="table table-bordered table-striped"
        >
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
            {filteredSales.map((sale) => (
              <React.Fragment key={sale._id}>
                <tr>
                  <td>{formatDate(sale.saleDate)}</td>
                  <td>{sale.customer?.name || "Walk-in Customer"}</td>
                  <td>{sale.products.reduce((sum, p) => sum + p.quantity, 0)}</td>
                  <td>{formatCurrency(sale.totalAmount)}</td>
                  <td>{sale.paymentMethod}</td>
                  <td>
                    <span
                      className={`badge ${
                        sale.status === "completed"
                          ? "bg-success"
                          : sale.status === "pending"
                          ? "bg-warning"
                          : sale.status === "returned"
                          ? "bg-secondary"
                          : "bg-danger"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => toggleSaleDetails(sale._id)}
                    >
                      {expandedSale === sale._id ? "Hide" : "Show"} Details
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
                            </tr>
                          </thead>
                          <tbody>
                            {sale.products.map((product, index) => (
                              <tr key={index}>
                                <td>{product.product?.name || "Unknown Product"}</td>
                                <td>{product.quantity}</td>
                                <td>
                                  {formatCurrency(
                                    product.quantity * product.product.price
                                  )}
                                </td>
                                <td>{product.returnedQuantity || 0}</td>
                                <td>
                                  <span className="badge bg-success">Sold</span>
                                </td>
                              </tr>
                            ))}
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