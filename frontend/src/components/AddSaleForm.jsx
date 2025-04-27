import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const SaleForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customer = queryParams.get("customer");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    customer: customer || "",
    products: [],
    paymentMethod: "cash",
    status: "completed",
    discount: 0,
    tax: 0,
    pointsToRedeem: 0,
    notes: "",
    saleDate: new Date().toISOString().split("T")[0], // Auto-fill today's date
  });

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    fetchProducts();
    if (customer) {
      fetchCustomerData();
    }
  }, [customer]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8070/products/");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8070/customers/${customer}`
      );
      setCustomerData(response.data);
    } catch (error) {
      toast.error("Failed to load customer data");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.saleDate) newErrors.saleDate = "Sale date is required.";
    if (formData.products.length === 0)
      newErrors.products = "At least one product must be added.";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required.";
    if (!formData.status) newErrors.status = "Status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const subtotal = formData.products.reduce(
        (sum, item) => sum + item.priceAtSale * item.quantity,
        0
      );
      const totalAmount = calculateTotal();
      const loyaltyEligibleAmount =
        subtotal - formData.discount + subtotal * (formData.tax / 100);

      const saleData = {
        ...formData,
        totalAmount,
        loyaltyEligibleAmount,
      };

      await axios.post("http://localhost:8070/sale/add", saleData);
      toast.success("Sale recorded successfully!");
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save sale");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = formData.products.reduce(
      (sum, item) => sum + item.priceAtSale * item.quantity,
      0
    );
    const pointsDiscount = formData.pointsToRedeem * 0.1;
    return (
      subtotal - formData.discount - pointsDiscount + subtotal * (formData.tax / 100)
    );
  };

  return (
    <div className="container mt-4">
      <h2>Record New Sale</h2>
      <form onSubmit={handleSubmit}>
        {/* Sale Date */}
        <div className="mb-3">
          <label htmlFor="saleDate" className="form-label">
            Sale Date
          </label>
          <input
            type="date"
            id="saleDate"
            className="form-control"
            value={formData.saleDate}
            onChange={(e) =>
              setFormData({ ...formData, saleDate: e.target.value })
            }
            required
          />
          {errors.saleDate && (
            <div className="text-danger">{errors.saleDate}</div>
          )}
        </div>

        {/* Select Product */}
        <div className="mb-3">
          <label htmlFor="product" className="form-label">
            Select Product
          </label>
          <select
            id="product"
            className="form-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            className="form-control"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        {/* Add Product Button */}
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              if (!selectedProduct) {
                toast.error("Please select a product");
                return;
              }
              const productToAdd = products.find(
                (p) => p._id === selectedProduct
              );
              if (productToAdd) {
                setFormData({
                  ...formData,
                  products: [
                    ...formData.products,
                    {
                      productId: productToAdd._id,
                      productName: productToAdd.name,
                      quantity,
                      priceAtSale: productToAdd.price,
                    },
                  ],
                });
                setSelectedProduct("");
                setQuantity(1);
              }
            }}
          >
            Add Product
          </button>
        </div>

        {/* List of Added Products */}
        {formData.products.length > 0 && (
          <div className="mb-3">
            <h5>Added Products:</h5>
            <ul className="list-group">
              {formData.products.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {item.productName} - {item.quantity} × {item.priceAtSale}
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      const newProducts = [...formData.products];
                      newProducts.splice(index, 1);
                      setFormData({ ...formData, products: newProducts });
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Payment Method */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              required
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="mobile_payment">Mobile Payment</option>
            </select>
            {errors.paymentMethod && (
              <div className="text-danger">{errors.paymentMethod}</div>
            )}
          </div>

          {/* Status */}
          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              required
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <div className="text-danger">{errors.status}</div>
            )}
          </div>
        </div>

        {/* Errors for products */}
        {errors.products && (
          <div className="text-danger mb-3">{errors.products}</div>
        )}

        {/* Submit Buttons */}
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Record Sale"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaleForm;
