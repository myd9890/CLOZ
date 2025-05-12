import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateProductForm = ({ fetchProducts }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productId: "",
    name: "",
    description: "",
    category: "",
    brand: "",
    size: "",
    color: "",
    material: "",
    gender: "",
    quantityInStock: 0,
    supplier: "",
    price: 0,
    supplierUnitPrice: 0,
  });

  const [errors, setErrors] = useState({});

  // Fetch product details to pre-fill the form
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/products/${productId}`
        );
        setProduct(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details");
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    // Remove numbers from the color field
    if (name === "color") {
      updatedValue = value.replace(/[0-9]/g, ""); 
    }

    setProduct((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Clear the error for the field when it changes
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!product.name) newErrors.name = "Name is required";
    if (!product.category) newErrors.category = "Category is required";
    if (!product.size) newErrors.size = "Size is required";
    if (!product.color) newErrors.color = "Color is required";
    if (!product.material) newErrors.material = "Material is required";
    if (!product.gender) newErrors.gender = "Gender is required";
    if (Number(product.quantityInStock) <= 0) {
      newErrors.quantityInStock = "Stock must be greater than 0";
    } else if (!Number.isInteger(Number(product.quantityInStock))) {
      newErrors.quantityInStock = "Invalid stock quantity";
    }
    if (!product.supplier) newErrors.supplier = "Supplier is required";
    if (Number(product.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    
    if (product.supplierUnitPrice <= 0)
      newErrors.supplierUnitPrice = "Price must be greater than 0";
    if (product.supplierUnitPrice > product.price)
      newErrors.supplierUnitPrice = "Supplier unit price must be less than or equal to the product price";    setErrors(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.put(
          `http://localhost:8070/products/update/${productId}`,
          product
        );
        toast.success("Product updated successfully!");
        fetchProducts(); 
        navigate("/InventoryDashboard/products"); 
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product");
      }
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-4">Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product ID:</label>
          <input
            type="text"
            name="productId"
            value={product.productId}
            className="form-control"
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            required
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category:</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            className={`form-control ${errors.category ? "is-invalid" : ""}`}
          />
          {errors.category && (
            <div className="invalid-feedback">{errors.category}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Size:</label>
          <select
            name="size"
            value={product.size}
            onChange={handleChange}
            className={`form-control ${errors.size ? "is-invalid" : ""}`}
          >
            <option value="">Select Size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="XXXL">XXXL</option>
          </select>
          {errors.size && (
            <div className="invalid-feedback">{errors.size}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Color:</label>
          <input
            type="text"
            name="color"
            value={product.color}
            onChange={handleChange}
            className={`form-control ${errors.color ? "is-invalid" : ""}`}
          />
          {errors.color && (
            <div className="invalid-feedback">{errors.color}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Material:</label>
          <input
            type="text"
            name="material"
            value={product.material}
            onChange={handleChange}
            className={`form-control ${errors.material ? "is-invalid" : ""}`}
          />
          {errors.material && (
            <div className="invalid-feedback">{errors.material}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Gender:</label>
          <select
            name="gender"
            value={product.gender}
            onChange={handleChange}
            className={`form-control ${errors.gender ? "is-invalid" : ""}`}
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
          {errors.gender && (
            <div className="invalid-feedback">{errors.gender}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Stock:</label>
          <input
            type="number"
            name="quantityInStock"
            value={product.quantityInStock}
            onChange={handleChange}
            className={`form-control ${errors.quantityInStock ? "is-invalid" : ""}`}
            required
          />
          {errors.quantityInStock && (
            <div className="invalid-feedback">{errors.quantityInStock}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            required
          />
          {errors.price && (
            <div className="invalid-feedback">{errors.price}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">supplier Unit Price:</label>
          <input
            type="number"
            name="supplierUnitPrice"
            value={product.supplierUnitPrice}
            onChange={handleChange}
            className={`form-control ${errors.supplierUnitPrice ? "is-invalid" : ""}`}
            required
          />
          {errors.supplierUnitPrice && (
            <div className="invalid-feedback">{errors.supplierUnitPrice}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProductForm;