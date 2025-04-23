import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../css/productlist.css";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalInventoryValue: 0,
    brandCount: 0,
    categories: {},
    topCategory: "",
    brands: {},
    priceDistribution: {},
    stockStatus: { low: 0, medium: 0, high: 0 },
    inventoryValueByCategory: {},
  });

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("bg-dark", darkMode);
    document.body.classList.toggle("text-white", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8070/products/");
      const data = response.data;
      setProducts(data);
      console.log(data);

      const totalProducts = data.length;
      const totalStock = data.reduce((sum, p) => sum + p.quantityInStock, 0);
      const totalInventoryValue = data.reduce(
        (sum, p) => sum + p.quantityInStock * p.price,
        0
      );
      const brandCount = new Set(data.map((p) => p.supplier?.brand)).size;

      // Category analytics
      const categories = {};
      const inventoryValueByCategory = {};
      data.forEach((p) => {
        categories[p.category] = (categories[p.category] || 0) + 1;
        inventoryValueByCategory[p.category] =
          (inventoryValueByCategory[p.category] || 0) + p.quantityInStock * p.price;
      });

      const topCategory = Object.entries(categories).reduce(
        (max, curr) => (curr[1] > max[1] ? curr : max),
        ["", 0]
      )[0];

      // Brand analytics
      const brands = {};
      data.forEach((p) => {
      if (p.supplier?.brand) {
      brands[p.supplier.brand] = (brands[p.supplier.brand] || 0) + 1;
       }
      });


      // Price distribution analytics
      const priceRanges = {
        "0-1000": 0,
        "1001-5000": 0,
        "5001-10000": 0,
        "10001+": 0,
      };
      data.forEach((p) => {
        if (p.price <= 1000) priceRanges["0-1000"]++;
        else if (p.price <= 5000) priceRanges["1001-5000"]++;
        else if (p.price <= 10000) priceRanges["5001-10000"]++;
        else priceRanges["10001+"]++;
      });

      // Stock status analytics
      const stockStatus = { low: 0, medium: 0, high: 0 };
      data.forEach((p) => {
        if (p.quantityInStock <= 10) stockStatus.low++;
        else if (p.quantityInStock <= 50) stockStatus.medium++;
        else stockStatus.high++;
      });

      setAnalytics({
        totalProducts,
        totalStock,
        totalInventoryValue,
        brandCount,
        categories,
        topCategory,
        brands,
        priceDistribution: priceRanges,
        stockStatus,
        inventoryValueByCategory,
      });
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const handleDelete = async (productId) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete this product?");
      if (!isConfirmed) return;
      await axios.delete(`http://localhost:8070/products/delete/${productId}`);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const downloadCSV = () => {
    const csvHeader = "Product ID,Name,Category,Brand,Stock,Price\n";
    const csvRows = products
      .map(
        (p) =>
          `${p.productId},"${p.name}","${p.category}","${p.supplier?.brand}",${p.quantityInStock},${p.price}`
      )
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "product_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text("Product Inventory Report", 14, 15);
  
    // Date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
  
    // Summary Section
    doc.setFontSize(14);
    doc.text("Summary", 14, 30);
  
    const summaryData = [
      ["Total Products", analytics.totalProducts],
      ["Total Stock", analytics.totalStock],
      ["Inventory Value", `LKR ${analytics.totalInventoryValue.toFixed(2)}`],
      ["Brands", analytics.brandCount],
      ["Top Category", analytics.topCategory || "N/A"]
    ];
  
    // Drawing the summary table
    autoTable(doc, {
      startY: 35,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });
  
    // Product List Table
    doc.setFontSize(14);
    doc.text("Product List", 14, doc.lastAutoTable.finalY + 15);
  
    const productsData = products.map(p => [
      p.productId,
      p.name,
      p.category,
      p.supplier?.brand ,
      p.quantityInStock,
      `LKR ${p.price}`
    ]);
  
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['ID', 'Name', 'Category', 'Brand', 'Stock', 'Price']],
      body: productsData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 }
      }
    });
  
    // Save the PDF
    doc.save(`product_inventory_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className={`container-fluid px-4 py-4 ${
      darkMode ? "bg-dark text-white" : "bg-light"
    }`}>
      {/* Header Row */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📦 Inventory Dashboard</h1>
        <div>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="btn btn-outline-secondary me-2"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button className="btn btn-outline-primary me-2" onClick={downloadPDF}>
            📄 Download PDF
          </button>
          <button className="btn btn-outline-success" onClick={downloadCSV}>
            ⬇️ Download CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4 g-4">
        {/* Cards */}
        {[
          { title: "Total Products", value: analytics.totalProducts, bg: "primary" },
          { title: "Total Stock", value: analytics.totalStock, bg: "success" },
          {
            title: "Inventory Value",
            value: `LKR ${analytics.totalInventoryValue.toFixed(2)}`,
            bg: "warning",
            text: "text-dark",
          },
          { title: "Brands", value: analytics.brandCount, bg: "info" },
        ].map((item, i) => (
          <div className="col-md-3" key={i}>
            <div className={`card bg-${item.bg} ${item.text || "text-white"} shadow`}>
              <div className="card-body text-center">
                <h5>{item.title}</h5>
                <h3>{item.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* First Row of Charts */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5 className="text-center">📊 Category Distribution</h5>
            <Pie
              data={{
                labels: Object.keys(analytics.categories),
                datasets: [
                  {
                    data: Object.values(analytics.categories),
                    backgroundColor: [
                      "#007bff",
                      "#28a745",
                      "#ffc107",
                      "#dc3545",
                      "#17a2b8",
                      "#6f42c1",
                    ],
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5 className="text-center">📦 Stock per Category</h5>
            <Bar
              data={{
                labels: Object.keys(analytics.categories),
                datasets: [
                  {
                    label: "Stock",
                    data: Object.keys(analytics.categories).map((cat) =>
                      products
                        .filter((p) => p.category === cat)
                        .reduce((sum, p) => sum + p.quantityInStock, 0)
                    ),
                    backgroundColor: "#17a2b8",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Second Row of Charts - NEW CHARTS */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5 className="text-center">💰 Price Distribution</h5>
            <Doughnut
              data={{
                labels: Object.keys(analytics.priceDistribution),
                datasets: [
                  {
                    data: Object.values(analytics.priceDistribution),
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#4BC0C0",
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5 className="text-center">🏷️ Brand Distribution</h5>
            <Pie
              data={{
                labels: Object.keys(analytics.brands),
                datasets: [
                  {
                    data: Object.values(analytics.brands),
                    backgroundColor: [
                      "#FF9F40",
                      "#FFCD56",
                      "#FF6384",
                      "#36A2EB",
                      "#9966FF",
                      "#4BC0C0",
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5 className="text-center">⚠️ Stock Status</h5>
            <Doughnut
              data={{
                labels: ["Low Stock (<10)", "Medium Stock (10-50)", "High Stock (>50)"],
                datasets: [
                  {
                    data: [
                      analytics.stockStatus.low,
                      analytics.stockStatus.medium,
                      analytics.stockStatus.high,
                    ],
                    backgroundColor: ["#FF6384", "#FFCE56", "#36A2EB"],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Third Row - Inventory Value Chart */}
      <div className="row mb-5">
        <div className="col-md-12">
          <div className="card p-3 shadow-sm">
            <h5 className="text-center"> Inventory Value by Category</h5>
            <Bar
              data={{
                labels: Object.keys(analytics.inventoryValueByCategory),
                datasets: [
                  {
                    label: "Inventory Value (LKR)",
                    data: Object.values(analytics.inventoryValueByCategory),
                    backgroundColor: "#4BC0C0",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return "LKR " + value.toLocaleString();
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Highlight */}
      <div className={`alert alert-info text-center fs-5 ${darkMode ? "bg-dark text-white" : ""}`}>
        Top Category: <strong>{analytics.topCategory || "N/A"}</strong>
      </div>

      {/* Add Product */}
      <div className="d-flex justify-content-end mb-3">
        <Link to="/products/add" className="btn btn-primary">
          ➕ Add New Product
        </Link>
      </div>

      {/* Product Table */}
      <div className="table-responsive">
        <table className={`table table-bordered table-striped shadow-sm ${darkMode ? "table-dark" : ""}`}>
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Stock</th>
              <th>Price</th>
              <th style={{ minWidth: "180px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.supplier?.brand}</td>
                <td>{product.quantityInStock}</td>
                <td>LKR {product.price}</td>
                <td>
                  <Link to={`/products/update/${product.productId}`} className="btn btn-success btn-sm me-2">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.productId)}
                    className="btn btn-danger btn-sm me-2"
                  >
                    Delete
                  </button>
                  <Link to={`/products/order/${product.productId}`} className="btn btn-secondary btn-sm me-2">
                    Order
                  </Link>
                  <button
                    className="btn btn-info btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target={`#orderModal${product._id}`}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {products.map((product) => (
        <div
          className="modal fade"
          id={`orderModal${product._id}`}
          tabIndex="-1"
          aria-labelledby="orderModalLabel"
          aria-hidden="true"
          key={product._id}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Product Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Product ID:</strong> {product.productId}</p>
                    <p><strong>Name:</strong> {product.name}</p>
                    <p><strong>Description:</strong> {product.description || "N/A"}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Brand:</strong> {product.supplier?.brand || "N/A"}</p>
                    <p><strong>Size:</strong> {product.size || "N/A"}</p>
                    <p><strong>Material:</strong> {product.material || "N/A"}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Color:</strong> {product.color?.join(", ") || "N/A"}</p>
                    <p><strong>Gender:</strong> {product.gender}</p>
                    <p><strong>Stock Quantity:</strong> {product.quantityInStock}</p>
                    <p><strong>Supplier:</strong> {product.supplier?.name || "N/A"}</p>
                    <p><strong>Price:</strong> LKR {product.price}.00</p>
                    <p><strong>Supplier Unit Price:</strong> LKR {product.supplierUnitPrice}.00</p>
                    <p><strong>Added Date:</strong> {new Date(product.addedDate).toLocaleDateString()}</p>
                    <p><strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;