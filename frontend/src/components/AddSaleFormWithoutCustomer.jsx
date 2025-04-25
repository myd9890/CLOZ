import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SaleForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    products: [],
    paymentMethod: "cash",
    status: "completed",
    discount: 0,
    pointsToRedeem: 0,
    tax: 0,
    notes: ""
  });

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8070/products/");
      setProducts(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct || quantity < 1) return;

    const product = products.find(p => p._id === selectedProduct);
    if (!product) return;

    const priceAtSale = product.price - (product.discountPrice || 0);

    const existingIndex = formData.products.findIndex(
      item => item.product === selectedProduct
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
            priceAtSale
          }
        ]
      });
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveProduct = (productId) => {
    setFormData({
      ...formData,
      products: formData.products.filter(item => item.product !== productId)
    });
  };

  const calculateTotal = () => {
    const subtotal = formData.products.reduce(
      (sum, item) => sum + (item.priceAtSale * item.quantity),
      0
    );
    return subtotal - formData.discount + (subtotal * (formData.tax / 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const saleData = {
        ...formData,
        totalAmount: calculateTotal()
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
      <h2>Record New Sale</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              required
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="mobile_payment">Mobile Payment</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-8">
            <label className="form-label">Add Product</label>
            <div className="input-group">
              <select
                className="form-select"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Select Product</option>
                {products
                  .filter(p => p.quantityInStock > 0)
                  .map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name} (LKR {product.price}, Discount: LKR {product.discountPrice || 0}, Stock: {product.quantityInStock})
                    </option>
                  ))}
              </select>
              <input
                type="number"
                className="form-control"
                style={{ width: "80px" }}
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddProduct}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {formData.products.length > 0 && (
          <div className="mb-3">
            <h5>Selected Products</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price (After Discount)</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.products.map((item) => {
                  const product = products.find(p => p._id === item.product);
                  return (
                    <tr key={item.product}>
                      <td>{product?.name || "Unknown Product"}</td>
                      <td>LKR {item.priceAtSale?.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>LKR {(item.priceAtSale * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveProduct(item.product)}
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
        )}

        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea
            className="form-control"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="mb-4 p-3 bg-light rounded">
          <h4 className="text-end">
            Total: LKR {calculateTotal().toFixed(2)}
          </h4>
        </div>

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
            disabled={loading || formData.products.length === 0}
          >
            {loading ? "Saving..." : "Record Sale"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaleForm;
