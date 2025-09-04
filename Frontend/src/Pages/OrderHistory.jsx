import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../Contexts/AllContext';
import { toast } from 'react-toastify';
import '../Style/OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API}/payment/orders`, { withCredentials: true });
            setOrders(response.data.orders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch your orders. Please try again later.');
            setLoading(false);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            setLoading(true);
            await axios.put(`${API}/payment/orders/${orderId}/cancel`, {}, { withCredentials: true });
            toast.success('Order cancelled successfully');
            fetchOrders();
            setSelectedOrder(null);
        } catch (error) {
            console.error('Error cancelling order:', error);
            const errorMessage = error.response?.data?.message || 'Failed to cancel order. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'All' || order.orderStatus === filterStatus;
        const matchesSearch = order.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const orderStatuses = ['All', ...new Set(orders.map(order => order.orderStatus))];

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Created': return 'status-created';
            case 'Paid': return 'status-paid';
            case 'Processing': return 'status-processing';
            case 'Packed': return 'status-packed';
            case 'Shipped': return 'status-shipped';
            case 'Delivered': return 'status-delivered';
            case 'Cancelled': return 'status-cancelled';
            case 'Returned': return 'status-returned';
            default: return 'status-default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Created': return '📋';
            case 'Paid': return '💳';
            case 'Processing': return '⚙️';
            case 'Packed': return '📦';
            case 'Shipped': return '🚚';
            case 'Delivered': return '✅';
            case 'Cancelled': return '❌';
            case 'Returned': return '↩️';
            default: return '🔘';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading && orders.length === 0) {
        return (
            <div className="orders-container">
                <div className="orders-loading">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <div className="orders-layout">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-content">
                        <h1>Order History</h1>
                        <p>Track and manage all your orders</p>
                    </div>
                </div>

                {/* Controls Section */}
                <div className="controls-section">
                    <div className="search-filter-container">
                        <div className="search-container">
                            <label>Search Orders</label>
                            <input
                                type="text"
                                placeholder="Search by order ID or customer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-container">
                            <label>Filter by Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                {orderStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="error-section">
                        <div className="alert error">
                            <span className="alert-icon">⚠️</span>
                            {error}
                        </div>
                    </div>
                )}

                {/* Orders Display */}
                <div className="orders-section">
                    {loading && orders.length === 0 ? (
                        <div className="loading-state">
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                            </div>
                            <p>Loading your orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h3>{orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}</h3>
                            <p>{orders.length === 0 ? 'Start shopping to see your orders here' : 'Try adjusting your search or filters'}</p>
                            {orders.length === 0 ? (
                                <Link to="/" className="btn-primary">Start Shopping</Link>
                            ) : (
                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterStatus('All');
                                    }}
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="orders-list">
                            {filteredOrders.map((order) => (
                                <div key={order._id} className="order-item">
                                    <div className="order-main-info">
                                        <div className="order-identifier">
                                            <span className="order-id">#{order.transactionId.substring(6, 14)}</span>
                                            <span className="order-date">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className="order-summary">
                                            <span className="order-amount">₹{order.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="order-status-info">
                                        <div className="status-container">
                                            <span className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                                                {getStatusIcon(order.orderStatus)} {order.orderStatus}
                                            </span>
                                        </div>
                                        <div className="payment-container">
                                            <span className={`payment-badge ${order.paymentStatus === 'Paid' ? 'paid' : order.paymentStatus === 'Failed' ? 'failed' : 'pending'}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="order-actions">
                                        <button
                                            className="btn-view"
                                            onClick={() => handleViewDetails(order)}
                                        >
                                            View Details
                                        </button>
                                        {(order.orderStatus === 'Created' || order.orderStatus === 'Paid') && (
                                            <button
                                                className="btn-cancel"
                                                onClick={() => handleCancelOrder(order._id)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={handleCloseDetails}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Order #{selectedOrder.transactionId.substring(6, 14)}</h2>
                            <button className="modal-close" onClick={handleCloseDetails}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            {/* Order Information */}
                            <div className="modal-section">
                                <h3>Order Information</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Order Date</span>
                                        <span className="info-value">{formatDate(selectedOrder.createdAt)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Payment Status</span>
                                        <span className={`info-value status-badge ${selectedOrder.paymentStatus === 'Paid' ? 'paid' : selectedOrder.paymentStatus === 'Failed' ? 'failed' : 'pending'}`}>
                                            {selectedOrder.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Order Status</span>
                                        <span className={`info-value status-badge ${getStatusBadgeClass(selectedOrder.orderStatus)}`}>
                                            {getStatusIcon(selectedOrder.orderStatus)} {selectedOrder.orderStatus}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Total Amount</span>
                                        <span className="info-value amount">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="modal-section">
                                <h3>Shipping Address</h3>
                                <div className="address-details">
                                    <p className="customer-name">{selectedOrder.shippingAddress.name}</p>
                                    <p className="address-line">{selectedOrder.shippingAddress.street}</p>
                                    <p className="address-line">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}</p>
                                    <p className="phone-number">Phone: {selectedOrder.shippingAddress.phone}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="modal-section">
                                <h3>Order Items</h3>
                                <div className="items-table">
                                    <div className="table-header">
                                        <span>Product</span>
                                        <span>Price</span>
                                        <span>Quantity</span>
                                        <span>Total</span>
                                    </div>
                                    {(selectedOrder.products || selectedOrder.orderItems || []).map((item, index) => (
                                        <div key={index} className="table-row">
                                            <span className="product-name">{item.productId?.name || 'Product'}</span>
                                            <span className="product-price">₹{item.price.toFixed(2)}</span>
                                            <span className="product-qty">{item.quantity}</span>
                                            <span className="product-total">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            {(selectedOrder.orderStatus === 'Created' || selectedOrder.orderStatus === 'Paid') && (
                                <button
                                    className="btn-cancel"
                                    onClick={() => handleCancelOrder(selectedOrder._id)}
                                >
                                    Cancel Order
                                </button>
                            )}
                            <button className="btn-secondary" onClick={handleCloseDetails}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;