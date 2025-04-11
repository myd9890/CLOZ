import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/SupplierOrder.css';

const ViewAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8070/order/allorders');
            setOrders(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Update order status (Accept/Reject)
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:8070/order/updateadminstatus/${orderId}`, { adminStatus: newStatus });
            // Refetch orders to update UI
            fetchOrders();
        } catch (error) {
            console.error(`Error updating order status:`, error);
        }
    };

    // Separate orders
    const pendingOrders = orders.filter(order => order.adminStatus === 'Pending');
    const otherOrders = orders.filter(order => order.adminStatus !== 'Pending');

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = otherOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4" style={{ color: '#333' }}>Supplier Orders Management</h2>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Pending Orders Table */}
                    <h3 className="text-center mb-3" style={{ color: '#555' }}>Pending Orders</h3>
                    {pendingOrders.length === 0 ? (
                        <p className="text-center text-muted">No pending orders found.</p>
                    ) : (
                        <div className="table-responsive mb-5">
                            <table className="table table-striped table-hover table-bordered">
                                <thead className="table-warning">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Product Name</th>
                                        <th>Supplier Name</th>
                                        <th>Quantity</th>
                                        <th>TotalPrice</th>
                                        <th>Approval Status</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingOrders.map(order => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.product?.name || 'N/A'}</td>
                                            <td>{order.supplier?.name || 'N/A'}</td>
                                            <td>{order.quantity}</td>
                                            <td>Rs.{order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-success me-2"
                                                    onClick={() => updateOrderStatus(order._id, 'Approved')}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => updateOrderStatus(order._id, 'Rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target={`#orderModal${order._id}`}>
                                                    View
                                                </button>

                                                {/* Modal for order details */}
                                                <div className="modal fade" id={`orderModal${order._id}`} tabIndex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="orderModalLabel">Order Details</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <p><strong>Order ID:</strong> {order._id}</p>
                                                                <p><strong>Product:</strong> {order.product?.name}</p>
                                                                <p><strong>Supplier:</strong> {order.supplier?.name}</p>
                                                                <p><strong>Quantity:</strong> {order.quantity}</p>
                                                                <p><strong>Total Price:</strong>Rs.{order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</p>
                                                                <p><strong>Supplier Status:</strong> {order.status}</p>
                                                                <hr />
                                                                <p><strong>Product Gender:</strong> {order.product?.gender}</p>
                                                                <p><strong>Size:</strong> {order.product?.size}</p>
                                                                <p><strong>Material:</strong> {order.product?.material}</p>
                                                                <p><strong>Color:</strong> {order.product?.color}</p>
                                                                <p><strong>Re-order Quantity:</strong> {order.product?.reOrderquantity}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Reviewed Orders Table */}
                    <h3 className="text-center mb-3" style={{ color: '#555' }}>Reviewed Orders</h3>
                    {otherOrders.length === 0 ? (
                        <p className="text-center text-muted">No orders found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Product Name</th>
                                        <th>Supplier Name</th>
                                        <th>Quantity</th>
                                        <th>Total Price</th>
                                        <th>Supplier Status</th>
                                        <th>Reorder Status</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.product?.name || 'N/A'}</td>
                                            <td>{order.supplier?.name || 'N/A'}</td>
                                            <td>{order.quantity}</td>
                                            <td>Rs.{order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</td>
                                            <td><span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                                            <td><span className={`badge ${getStatusClass(order.adminStatus)}`}>{order.adminStatus}</span></td>
                                            <td>
                                                <button className="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target={`#orderModal${order._id}`}>View</button>
                                                <div className="modal fade" id={`orderModal${order._id}`} tabIndex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title">Order Details</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <p><strong>Order ID:</strong> {order._id}</p>
                                                                <p><strong>Product:</strong> {order.product?.name}</p>
                                                                <p><strong>Supplier:</strong> {order.supplier?.name}</p>
                                                                <p><strong>Quantity:</strong> {order.quantity}</p>
                                                                <p><strong>Total Price:</strong>Rs.{order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</p>
                                                                <p><strong>Supplier Status:</strong> {order.status}</p>
                                                                <hr />
                                                                <p><strong>Product Gender:</strong> {order.product?.gender}</p>
                                                                <p><strong>Size:</strong> {order.product?.size}</p>
                                                                <p><strong>Material:</strong> {order.product?.material}</p>
                                                                <p><strong>Color:</strong> {order.product?.color}</p>
                                                                <p><strong>Re-order Quantity:</strong> {order.product?.reOrderquantity}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-center mt-3">
                                <nav>
                                    <ul className="pagination">
                                        {[...Array(Math.ceil(otherOrders.length / ordersPerPage)).keys()].map(number => (
                                            <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                                <button onClick={() => paginate(number + 1)} className="page-link">{number + 1}</button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const getStatusClass = (status) => {
    switch (status) {
        case 'Pending': return 'bg-warning';
        case 'Accepted': return 'bg-success';
        case 'Rejected': return 'bg-danger';
        case 'Approved': return 'bg-success';
        default: return 'bg-secondary';
    }
};

export default ViewAllOrders;