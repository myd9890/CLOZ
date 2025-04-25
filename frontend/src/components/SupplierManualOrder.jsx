import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceOrderForm = () => {
    const { productId } = useParams();
    const [formData, setFormData] = useState({
        productName: "",
        supplierName: "",
        quantity: "",
    });
    const [supplierUnitPrice, setUnitPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [supplierObjectId, setSupplierId] = useState(null);
    const [productObjectId, setProductObjectId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Calculate total price when quantity changes
        if (name === "quantity") {
            setTotalPrice(value * supplierUnitPrice);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8070/products/${productId}`
                );
                console.log(response.data);
                const productObjectId = response.data._id;
                setProductObjectId(productObjectId);
                const supplierId = response.data.supplier;
                setSupplierId(supplierId);

                const supplierResponse = await axios.get(
                    `http://localhost:8070/supplier/${supplierId}`
                );
                console.log(supplierResponse.data);
                const supplierName = supplierResponse.data.name;

                setFormData({
                    productName: response.data.name,
                    supplierName: supplierName,
                    quantity: "",
                });

                setUnitPrice(response.data.supplierUnitPrice); 
                setTotalPrice(0); 
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to fetch product details");
            }
        };

        fetchProduct();
    }, [productId]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            await axios.post("http://localhost:8070/order/place", {
                productObjectId,
                supplierObjectId,
                quantity: formData.quantity,
                totalPrice, 
            });
            console.log("Sending:", {
                productObjectId,
                supplierObjectId,
                quantity: formData.quantity,
                totalPrice,
            });

            toast.success("Order placed successfully!");
            setFormData({ productName: "", supplierName: "", quantity: "" });
            setTotalPrice(0);
        } catch (error) {
            setError("Failed to place order. Please try again.");
            console.error("Error placing order:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4" style={{ color: "#333" }}>Place an Order</h2>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
                {/* Product Name */}
                <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="productName"
                        value={formData.productName}
                        required
                        readOnly
                    />
                </div>

                {/* Supplier Name */}
                <div className="mb-3">
                    <label className="form-label">Supplier Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="supplierName"
                        value={formData.supplierName}
                        required
                        readOnly
                    />
                </div>

                {/* Quantity */}
                <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>

                {/* Total Price */}
                <div className="mb-3">
                    <label className="form-label">Total Price</label>
                    <input
                        type="text"
                        className="form-control"
                        value={totalPrice.toFixed(2)} 
                        readOnly
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Placing Order..." : "Place Order"}
                </button>
            </form>
        </div>
    );
};

export default PlaceOrderForm;
