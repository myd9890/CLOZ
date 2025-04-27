import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/SupplierOrder.css';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ViewAllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAnalytics, setShowAnalytics] = useState(false);
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

    // Generate PDF report for a single order
    const generateOrderReport = (order) => {
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(18);
        doc.text(`Order Report: ${order._id}`, 14, 15);
        
        // Date
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
        
        // Order Details
        doc.setFontSize(14);
        doc.text("Order Information", 14, 30);
        
        const orderDetails = [
            ["Order ID", order._id],
            ["Product Name", order.product?.name || "N/A"],
            ["Supplier", order.supplier?.name || "N/A"],
            ["Quantity", order.quantity],
            ["Total Price", `Rs.${order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}`],
            ["Supplier Status", order.status],
            ["Admin Status", order.adminStatus || "Pending"],
            ["Date", new Date(order.createdAt).toLocaleDateString()]
        ];
        
        autoTable(doc, {
            startY: 35,
            head: [['Field', 'Value']],
            body: orderDetails,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            columnStyles: {
                0: { cellWidth: 60, fontStyle: 'bold' },
                1: { cellWidth: 120 }
            }
        });
        
        // Product Details
        doc.setFontSize(14);
        doc.text("Product Details", 14, doc.lastAutoTable.finalY + 15);
        
        const productDetails = [
            ["Gender", order.product?.gender || "N/A"],
            ["Size", order.product?.size || "N/A"],
            ["Material", order.product?.material || "N/A"],
            ["Color", order.product?.color || "N/A"],
            ["Reorder Quantity", order.product?.reOrderquantity || "N/A"]
        ];
        
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Field', 'Value']],
            body: productDetails,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            columnStyles: {
                0: { cellWidth: 60, fontStyle: 'bold' },
                1: { cellWidth: 120 }
            }
        });
        
        // Save the PDF
        doc.save(`order_report_${order._id}.pdf`);
    };

    // Separate orders
    const pendingOrders = orders.filter(order => order.adminStatus === 'Pending');
    const otherOrders = orders.filter(order => order.adminStatus !== 'Pending');

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = otherOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Analytics Data Preparation
    const getStatusDistribution = () => {
        const statusCounts = orders.reduce((acc, order) => {
            acc[order.adminStatus] = (acc[order.adminStatus] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(statusCounts),
            datasets: [
                {
                    label: 'Orders by Status',
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    const getSupplierDistribution = () => {
        const supplierCounts = orders.reduce((acc, order) => {
            const supplierName = order.supplier?.name || 'Unknown';
            acc[supplierName] = (acc[supplierName] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(supplierCounts),
            datasets: [
                {
                    label: 'Orders by Supplier',
                    data: Object.values(supplierCounts),
                    backgroundColor: Object.keys(supplierCounts).map(
                        (_, i) => `hsl(${(i * 360) / Object.keys(supplierCounts).length}, 70%, 50%)`
                    ),
                    borderWidth: 1,
                },
            ],
        };
    };

    const getMonthlyOrderTrends = () => {
        // Group orders by month
        const monthlyData = orders.reduce((acc, order) => {
            const date = new Date(order.createdAt || Date.now());
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
            acc[monthYear] = (acc[monthYear] || 0) + 1;
            return acc;
        }, {});

        // Sort by date
        const sortedMonths = Object.keys(monthlyData).sort();
        
        return {
            labels: sortedMonths,
            datasets: [
                {
                    label: 'Orders per Month',
                    data: sortedMonths.map(month => monthlyData[month]),
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
            ],
        };
    };

    const getTotalOrderValue = () => {
        return orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2);
    };

    const getAverageOrderValue = () => {
        return orders.length > 0 
            ? (orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0) / orders.length).toFixed(2)
            : 0;
    };

    return (
        <div className="mt-5 mx-auto" style={{ width: '95%' }}>
            <h2 className="text-center mb-4" style={{ color: '#333' }}>Supplier Orders Management</h2>

            <div className="text-center mb-4">
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                >
                    {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                </button>
            </div>

            {showAnalytics && (
                <div className="analytics-section mb-5 p-4 border rounded shadow-sm">
                    <h3 className="text-center mb-4">Order Analytics</h3>

                    <div className="row">
                        <div className="col-md-3">
                            <div className="card text-white bg-secondary mb-2 p-2">
                                <div className="card-header py-1 px-2">Total Orders</div>
                                <div className="card-body py-2 px-2">
                                    <h5 className="card-title mb-0">{orders.length}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-bg-info mb-2 p-2">
                                <div className="card-header py-1 px-2">Total Order Value</div>
                                <div className="card-body py-2 px-2">
                                    <h5 className="card-title mb-0">Rs.{getTotalOrderValue()}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-white bg-warning mb-2 p-2">
                                <div className="card-header py-1 px-2">Average Order Value</div>
                                <div className="card-body py-2 px-2">
                                    <h5 className="card-title mb-0">Rs.{getAverageOrderValue()}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-white bg-danger mb-2 p-2">
                                <div className="card-header py-1 px-2">Pending Orders</div>
                                <div className="card-body py-2 px-2">
                                    <h5 className="card-title mb-0">{pendingOrders.length}</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container-fluid">
                        <div className="row mb-4">
                            {/* Orders by Supplier */}
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className="card-header bg-success text-white">
                                        <h5 className="mb-0">Orders by Supplier</h5>
                                    </div>
                                    <div className="card-body">
                                        <Bar data={getSupplierDistribution()} />
                                    </div>
                                </div>
                            </div>

                            {/* Order Status Distribution */}
                            <div className="col-md-6">
                                <div className="card h-100">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">Order Status Distribution</h5>
                                    </div>
                                    <div className="card-body">
                                        <Pie data={getStatusDistribution()} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Order Trends */}
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header bg-info text-white">
                                        <h5 className="mb-0">Monthly Order Trends</h5>
                                    </div>
                                    <div className="card-body">
                                        <Bar
                                            data={getMonthlyOrderTrends()}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        title: {
                                                            display: true,
                                                            text: 'Number of Orders',
                                                        },
                                                    },
                                                    x: {
                                                        title: {
                                                            display: true,
                                                            text: 'Month',
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                            <div className="d-flex">
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
                                            </div>
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
                                                            <div className="modal-footer">
                                                                <button 
                                                                    className="btn btn-primary"
                                                                    onClick={() => generateOrderReport(order)}
                                                                >
                                                                    Download Report
                                                                </button>
                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
                                        <th>Manager Status</th>
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
                                                                <p><strong>Admin Status:</strong> {order.adminStatus}</p>
                                                                <hr />
                                                                <p><strong>Product Gender:</strong> {order.product?.gender}</p>
                                                                <p><strong>Size:</strong> {order.product?.size}</p>
                                                                <p><strong>Material:</strong> {order.product?.material}</p>
                                                                <p><strong>Color:</strong> {order.product?.color}</p>
                                                                <p><strong>Re-order Quantity:</strong> {order.product?.reOrderquantity}</p>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button 
                                                                    className="btn btn-primary"
                                                                    onClick={() => generateOrderReport(order)}
                                                                >
                                                                    Download Report
                                                                </button>
                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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