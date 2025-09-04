import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../Redux/OrderSlice";
import "../Style/OrdersTab.css"

const OrdersTab = ({ activeTab }) => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        if (activeTab === "orders") {
            dispatch(fetchOrders());
        }
    }, [activeTab, dispatch]);

    // Filter logic
    const filteredOrders =
        filter === "All"
            ? orders.orders
            : orders.orders.filter((o) => {
                if (filter === "Pending") return o.paymentStatus === "Pending";
                if (filter === "Completed") return o.orderStatus === "Completed";
                if (filter === "Cancelled") return o.orderStatus === "Cancelled";
                return true;
            });


    return (
        <>

            <div className="admin-tabs">
                {/* Tab Buttons */}
                <div className="admin-tab-header">
                    {["All Orders", "Pending", "Completed", "Cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`admin-tab-button ${filter === tab ? "active" : ""
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {loading ? (
                    <p>Loading orders...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <div className="admin-tab-content">
                        {filteredOrders.length === 0 ? (
                            <p>No {filter} orders found.</p>
                        ) : (
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>User</th>
                                        <th>Total Amount</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order._id}>
                                            <td>#{order.transactionId}</td>
                                            <td>
                                                {order.user.fullname} <br />
                                                <small>{order.user.email}</small>
                                            </td>
                                            <td>₹{order.totalAmount}</td>
                                            <td>
                                                {order.paymentMethod} <br />
                                                <span
                                                    className={`status-badge ${order.paymentStatus === "Paid"
                                                            ? "success"
                                                            : "warning"
                                                        }`}
                                                >
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`status-badge ${order.orderStatus === "Completed"
                                                            ? "success"
                                                            : order.orderStatus === "Cancelled"
                                                                ? "danger"
                                                                : "warning"
                                                        }`}
                                                >
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td>
                                                {new Date(order.createdAt).toLocaleDateString()} <br />
                                                <small>
                                                    {new Date(order.createdAt).toLocaleTimeString()}
                                                </small>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </>
    
  );
};

export default OrdersTab;