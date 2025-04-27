import React, { useState, useEffect } from "react";
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
    taxPercentage: 0,
    taxAmount: 0,
    totalPrice: 0,
    images: [],
  });

  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sizeType, setSizeType] = useState("letter");

  // Calculate tax and total price whenever price or tax percentage changes
  useEffect(() => {
    const taxAmount = (product.price * product.taxPercentage) / 100;
    const totalPrice = product.price + taxAmount;
    
    setProduct(prev => ({
      ...prev,
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2))
    }));
  }, [product.price, product.taxPercentage]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "color") {
      updatedValue = value.replace(/[0-9]/g, "");
    }

    if (['price', 'supplierUnitPrice', 'quantityInStock', 'taxPercentage'].includes(name)) {
      updatedValue = value === '' ? 0 : parseFloat(value);
    }

    setProduct(prev => ({
      ...prev,
      [name]: updatedValue,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setProduct(prev => ({
      ...prev,
      category: category,
      size: "",
    }));
    
    if (category.toLowerCase().includes("trouser") || 
        category.toLowerCase().includes("pant") ||
        category.toLowerCase().includes("shoe")) {
      setSizeType("number");
    } else {
      setSizeType("letter");
    }
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:8070/supplier/");
        const data = await response.json();
        setSuppliers(data); 
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};

    if (!product.productId) newErrors.productId = "Product ID is required";
    if (!product.name) newErrors.name = "Name is required";
    if (!product.category) newErrors.category = "Category is required";
    if (!product.size) newErrors.size = "Size is required";
    if (!product.color) newErrors.color = "Color is required";
    if (!product.material) newErrors.material = "Material is required";
    if (!product.gender) newErrors.gender = "Gender is required";
    if (product.quantityInStock <= 0) {
      newErrors.quantityInStock = "Stock must be greater than 0";
    } else if (!Number.isInteger(product.quantityInStock)) {
      newErrors.quantityInStock = "Invalid stock quantity";
    }
    if (!product.supplier) newErrors.supplier = "Supplier is required";
    if (product.price <= 0) newErrors.price = "Price must be greater than 0";
    if (product.supplierUnitPrice <= 0) {
      newErrors.supplierUnitPrice = "Price must be greater than 0";
    }
    if (product.supplierUnitPrice > product.price) {
      newErrors.supplierUnitPrice =
        "Supplier unit price must be less than or equal to the product price";
    }
    if (product.taxPercentage < 0 || product.taxPercentage > 100) {
      newErrors.taxPercentage = "Tax percentage must be between 0 and 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post("http://localhost:8070/products/add", product);
        toast.success("Product added successfully!");
        fetchProducts();
        navigate("/InventoryDashboard/products/");
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error("Failed to add product");
      }
    }
  };

  const numericSizes = [];
  for (let i = 28; i <= 48; i++) {
    numericSizes.push(i);
  }

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
            onChange={handleCategoryChange}
            className={`form-control ${errors.category ? "is-invalid" : ""}`}
            list="categoryOptions"
          />
          <datalist id="categoryOptions">
            <option value="T-Shirt" />
            <option value="Shirt" />
            <option value="Trouser" />
            <option value="Jeans" />
            <option value="Jacket" />
            <option value="Shoes" />
            <option value="Accessories" />
          </datalist>
          {errors.category && (
            <div className="invalid-feedback">{errors.category}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Size:</label>
          {sizeType === "letter" ? (
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
          ) : (
            <select
              name="size"
              value={product.size}
              onChange={handleChange}
              className={`form-control ${errors.size ? "is-invalid" : ""}`}
            >
              <option value="">Select Size</option>
              {numericSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          )}
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
            <option value="Unisex">Unisex</option>
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
            className={`form-control ${
              errors.quantityInStock ? "is-invalid" : ""
            }`}
            required
            min="1"
            step="1"
          />
          {errors.quantityInStock && (
            <div className="invalid-feedback">{errors.quantityInStock}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Supplier:</label>
          
          <select
            name="supplier"
            value={product.supplier}
            onChange={handleChange}
            className={`form-control ${errors.supplier ? "is-invalid" : ""}`}
          >
            <option value="">Select Supplier</option>
            {filteredSuppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.brand}
              </option>
            ))}
          </select>
          {errors.supplier && (
            <div className="invalid-feedback">{errors.supplier}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Unit Price :</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            required
            step="0.01"
            min="0"
          />
          {errors.price && (
            <div className="invalid-feedback">{errors.price}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Tax Percentage:</label>
          <input
            type="number"
            name="taxPercentage"
            value={product.taxPercentage}
            onChange={handleChange}
            className={`form-control ${errors.taxPercentage ? "is-invalid" : ""}`}
            step="0.01"
            min="0"
            max="100"
          />
          {errors.taxPercentage && (
            <div className="invalid-feedback">{errors.taxPercentage}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Tax Amount:</label>
          <input
            type="number"
            name="taxAmount"
            value={product.taxAmount}
            className="form-control"
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Price :</label>
          <input
            type="number"
            name="totalPrice"
            value={product.totalPrice}
            className="form-control"
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Supplier Unit Price:</label>
          <input
            type="number"
            name="supplierUnitPrice"
            value={product.supplierUnitPrice}
            onChange={handleChange}
            className={`form-control ${
              errors.supplierUnitPrice ? "is-invalid" : ""
            }`}
            required
            step="0.01"
            min="0"
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