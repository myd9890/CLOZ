import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AddProductForm.css";


const AddProductForm = ({ fetchProducts }) => {
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
    supplierUnitPrice: 0,
    price: 0,
    images: [],
  });

  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  
 

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value,files } = e.target;

    let updatedValue = value;

    // Remove numbers from the color field
    if (name === "color") {
      updatedValue = value.replace(/[0-9]/g, ""); // Remove all numeric characters
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

  useEffect(() => {
    const fetchSuppliers = async () => {
        try {
            const response = await fetch('http://localhost:8070/supplier/');
            const data = await response.json();
            setSuppliers(data); // Store the list of suppliers
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    fetchSuppliers();
}, []);


  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!product.productId) newErrors.productId = "Product ID is required";
    if (!product.name) newErrors.name = "Name is required";
    if (!product.category) newErrors.category = "Category is required";
    //if (!product.brand) newErrors.brand = "Brand is required";
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
    if (product.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (product.supplierUnitPrice <= 0)
      newErrors.supplierUnitPrice = "Price must be greater than 0";
    if (product.supplierUnitPrice > product.price)
      newErrors.supplierUnitPrice = "Supplier unit price must be less than or equal to the product price";    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post("http://localhost:8070/products/add", product);
        toast.success("Product added successfully!");
        fetchProducts(); 
        navigate("/products/"); 
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error("Failed to add product");
      }
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product ID:</label>
          <input
            type="text"
            name="productId"
            value={product.productId}
            onChange={handleChange}
            className={`form-control ${errors.productId ? "is-invalid" : ""}`}
            required
          />
          {errors.productId && (
            <div className="invalid-feedback">{errors.productId}</div>
          )}
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
          <label className="form-label">Brand:</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            className={`form-control ${errors.brand ? "is-invalid" : ""}`}
          />
          {errors.brand && (
            <div className="invalid-feedback">{errors.brand}</div>
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
            <label className="form-label">Supplier:</label>
            
            {/* Search input */}
            <input
                type="text"
                className="form-control mb-2"
                placeholder="Search supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
                name="supplier"
                value={product.supplier}
                onChange={handleChange}
                className={`form-control ${errors.supplier ? "is-invalid" : ""}`}
            >
                <option value="">Select Supplier</option>
                {filteredSuppliers.map(supplier => (
                    <option key={supplier._id} value={supplier._id}>
                        {supplier.name} {/* Or any other property of Supplier */}
                    </option>
                ))}
            </select>

            {errors.supplier && <div className="invalid-feedback">{errors.supplier}</div>}
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
          <label className="form-label">Supplier Unit Price:</label>
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
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;