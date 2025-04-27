import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const SaleForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customer = queryParams.get("customer");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    customer: customer || "",
    products: [],
    paymentMethod: "cash",
    status: "completed",
    discount: 0,
    tax: 0,
    pointsToRedeem: 0,
    notes: "",
  });

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    console.log("Customer from URL:", customer);
    fetchProducts();
    if (customer) {
      fetchCustomerData();
    }
  }, [customer]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8070/products/");
      setProducts(response.data);
      console.log(response.data);
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

  const handleAddProduct = () => {
    if (!selectedProduct || quantity < 1) return;

    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    const priceAtSale = product.price - (product.discountPrice || 0);

    const existingIndex = formData.products.findIndex(
      (item) => item.product === selectedProduct
    );

    if (existingIndex >= 0) {
      const updatedProducts = [...formData.products];
      updatedProducts[existingIndex].quantity += quantity;
      setFormData({ ...formData, products: updatedProducts });
    } else {
      setFormData({
        ...formData,
        products: [
          ...formData.products,
          {
            product: selectedProduct,
            quantity,
            priceAtSale,
          },
        ],
      });
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveProduct = (productId) => {
    setFormData({
      ...formData,
      products: formData.products.filter((item) => item.product !== productId),
    });
  };

  const calculateTotal = () => {
    const subtotal = formData.products.reduce(
      (sum, item) => sum + item.priceAtSale * item.quantity,
      0
    );
    const pointsDiscount = formData.pointsToRedeem * 0.1; // Assuming 1 point = $0.10
    return (
      subtotal -
      formData.discount -
      pointsDiscount +
      subtotal * (formData.tax / 100)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pointsDiscount = formData.pointsToRedeem * 0.1;
      const subtotal = formData.products.reduce(
        (sum, item) => sum + item.priceAtSale * item.quantity,
        0
      );
      const totalAmount = calculateTotal();

      // Calculate amount eligible for loyalty points (excluding points discount)
      const loyaltyEligibleAmount =
        subtotal - formData.discount + subtotal * (formData.tax / 100);

      const saleData = {
        ...formData,
        totalAmount,
        loyaltyEligibleAmount, // Add this field to track amount eligible for points
      };
      console.log(saleData);

      await axios.post("http://localhost:8070/sale/add", saleData);
      toast.success("Sale recorded successfully!");

      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center">
        <div
          className="card shadow-sm"
          style={{ maxWidth: "800px", width: "100%" }}
        >
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0 text-center">Record New Sale</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Payment Method and Status */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="mobile_payment">Mobile Payment</option>
                  </select>
                </div>

                <div className="col-md-6">
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
                </div>
              </div>

              {/* Add Product */}
              <div className="row mb-4">
                <div className="col-md-12">
                  <label className="form-label">Add Product</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Select Product</option>
                      {products
                        .filter((p) => p.quantityInStock > 0)
                        .map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name} (LKR:{product.price} Discount:
                            {product.discountPrice} Tax:{product.taxAmount}{" "}
                            Stock: {product.quantityInStock})
                          </option>
                        ))}
                    </select>
                    <input
                      type="number"
                      className="form-control"
                      style={{ maxWidth: "100px" }}
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 0)
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddProduct}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Selected Products */}
              {formData.products.length > 0 && (
                <div className="mb-4">
                  <h5>Selected Products</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.products.map((item) => {
                          const product = products.find(
                            (p) => p._id === item.product
                          );
                          return (
                            <tr key={item.product}>
                              <td>{product?.name || "Unknown Product"}</td>
                              <td>LKR {item.priceAtSale?.toFixed(2)}</td>
                              <td>{item.quantity}</td>
                              <td>
                                LKR{" "}
                                {(item.priceAtSale * item.quantity).toFixed(2)}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    handleRemoveProduct(item.product)
                                  }
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Loyalty Points */}
              {customerData && (
                <div className="row mb-4">
                  <div className="col-md-12">
                    <div className="card border-primary">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Loyalty Points</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <p className="card-text">
                            <strong>Available Points:</strong>{" "}
                            <span className="badge bg-success">
                              {customerData.loyaltyPoints}
                            </span>
                          </p>
                          <label
                            htmlFor="pointsToRedeem"
                            className="form-label"
                          >
                            Points to Redeem
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="pointsToRedeem"
                            min="0"
                            max={customerData.loyaltyPoints}
                            value={formData.pointsToRedeem}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pointsToRedeem: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                          <div className="mt-2">
                            <p className="text-success">
                              <strong>Discount from Points: </strong>LKR{" "}
                              {(formData.pointsToRedeem * 0.1).toFixed(2)}
                            </p>
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  pointsToRedeem: 0,
                                })
                              }
                            >
                              Clear Points
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="mb-4 p-3 bg-light rounded">
                <h4 className="text-end text-primary">
                  Total: LKR {calculateTotal().toFixed(2)}
                </h4>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{ width: "150px" }}
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "150px" }}
                  disabled={loading || formData.products.length === 0}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Saving...
                    </>
                  ) : (
                    "Record Sale"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleForm;
