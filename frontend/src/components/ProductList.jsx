import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../css/productlist.css";

const ProductList = ({ products, fetchProducts }) => {
  // Delete a product
  const handleDelete = async (productId) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete this product?");
  
      if (!isConfirmed) {
        return; // If user cancels, exit the function
      }
      await axios.delete(`http://localhost:8070/products/delete/${productId}`);
      toast.success("Product deleted successfully!");
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <h1 className="text-center mb-4">Inventory Dashboard</h1>
      <h2 className="mb-4">Product List</h2>
      <Link to="/products/add" className="btn btn-primary mb-4">
        Add New Product
      </Link>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>{product.quantityInStock}</td>
              <td>Rs{product.price}</td>
              <td>
                <Link
                  to={`/products/update/${product.productId}`}
                  className="btn btn-success btn-sm me-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.productId)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
                <Link
                  to={`/products/order/${product.productId}`}
                  className="btn btn-success btn-sm me-2"
                >
                  Order
                </Link>
                <button className="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target={`#orderModal${product._id}`}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.map((product) => (
        <div className="modal fade" id={`orderModal${product._id}`} tabIndex="-1" aria-labelledby="orderModalLabel" aria-hidden="true" key={product._id}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="orderModalLabel">Product Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
              {console.log(product)}
                <p><strong>Product ID:</strong> {product.productId}</p>
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Description:</strong> {product.description || "N/A"}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Brand:</strong> {product.brand || "N/A"}</p>
                <p><strong>Size:</strong> {product.size || "N/A"}</p>
                <p><strong>Material:</strong> {product.material || "N/A"}</p>
                <p><strong>Color:</strong> {product.color.length > 0 ? product.color.join(", ") : "N/A"}</p>
                <p><strong>Gender:</strong> {product.gender}</p>
                <p><strong>Stock Quantity:</strong> {product.quantityInStock}</p>
                <p><strong>Supplier:</strong> {product.supplier?.name || "N/A"}</p>
                <p><strong>Price:</strong> Rs{product.price}.00</p>
                <p><strong>Supplier Unit Price:</strong> Rs.{product.supplierUnitPrice}.00</p>
                <p><strong>Added Date:</strong> {new Date(product.addedDate).toLocaleDateString()}</p>
                <p><strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;