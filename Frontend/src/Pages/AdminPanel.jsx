import React, { useContext, useEffect, useState } from "react";
import ShowProducts from "./ShowProducts";
import CreateProduct from "./CreateProduct";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from '../Contexts/AllContext'
import { MyContext } from '../Contexts/AllContext';
import { FaShoppingBag, FaUsers, FaClipboardList, FaPlus, FaSignOutAlt, FaTachometerAlt, FaChartLine, FaCog, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Style/AdminPanel.css';
import { useDispatch, useSelector } from "react-redux";
import OrdersTab from "../Components/OrdersTab";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    recentOrders: [],
    revenue: 0,
    topProducts: [],
    userGrowth: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [30, 45, 60, 75, 95, 120]
    },
    salesData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [1200, 1900, 1500, 2100, 2400, 2800]
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({ name: 'Admin User' });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order received', time: '10 minutes ago', read: false },
    { id: 2, message: 'Low stock alert: Product XYZ', time: '1 hour ago', read: false },
    { id: 3, message: 'Payment processed successfully', time: '3 hours ago', read: true }
  ]);

  const navigate = useNavigate();
  const { product, setproduct } = useContext(MyContext);


  const isAdmin = async () => {
    setIsLoading(true);
    try {
      // Verify admin authentication
      const adminToken = Cookies.get('adminToken');
      if (!adminToken) {
        throw new Error('Admin token not found');
      }

      // Fetch products
      let productResponse = await axios.get(`${API}/product/allproducts`, { withCredentials: true });
      setproduct(productResponse.data.products);

      // Fetch admin info from backend
      try {
        const adminResponse = await axios.get(`${API}/owner/profile`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });

        if (adminResponse.data && adminResponse.data.owner) {
          setAdminInfo({
            name: adminResponse.data.owner.fullName || 'Admin User',
            email: adminResponse.data.owner.email,
            role: adminResponse.data.owner.role || 'Admin',
            lastLogin: new Date(adminResponse.data.owner.lastLogin || Date.now()).toLocaleString()
          });
        } else {
          throw new Error('Admin profile data not found');
        }
      } catch (error) {
        console.log("Error fetching admin info:", error);
        toast.warning("Could not fetch admin profile information");

        // Fallback to basic admin info
        setAdminInfo({
          name: 'Admin User',
          email: 'admin@repcore.com',
          role: 'Admin',
          lastLogin: new Date().toLocaleString()
        });
      }

      // Fetch notifications from backend
      try {
        const notificationsResponse = await axios.get(`${API}/owner/notifications`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });

        if (notificationsResponse.data && notificationsResponse.data.notifications) {
          setNotifications(notificationsResponse.data.notifications.map(notification => ({
            id: notification._id,
            message: notification.message,
            time: new Date(notification.createdAt).toLocaleString(),
            read: notification.read || false
          })));
        }
      } catch (error) {
        console.log("Error fetching notifications:", error);
        // Keep default notifications if backend fails
      }

      // Calculate stats
      if (productResponse.data.products) {
        const products = productResponse.data.products;
        setStats(prevStats => ({
          ...prevStats,
          totalProducts: products.length,
          totalUsers: Math.floor(Math.random() * 1000) + 500, // Mock data
          totalOrders: Math.floor(Math.random() * 500) + 200, // Mock data
          revenue: Math.floor(Math.random() * 50000) + 25000, // Mock data
        }));
      }

      setIsLoading(false);
    } catch (error) {
      console.log("Admin verification error:", error);
      toast.error("Admin verification failed. Please login again.");
      navigate('/admin/login');
    }
  };

  useEffect(() => {
    isAdmin();
  }, []);

  const handleLogout = () => {
    Cookies.remove('adminToken');
    toast.success("Logged out successfully");
    navigate('/admin/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* Top Navigation Bar */}
      <nav className="admin-navbar">
        <div className="admin-navbar-content">
          <a href="#" className="admin-brand">
            <div className="admin-brand-icon">
              <FaTachometerAlt />
            </div>
            RepCore Admin
          </a>

          <div className="admin-nav-right">
            <div className="admin-search">
              <FaSearch className="admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search products, orders, users..."
              />
            </div>

            <div className="admin-notifications" onClick={toggleNotifications}>
              <FaBell />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}

              {showNotifications && (
                <div className="notifications-panel">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <p className="notification-message">{notification.message}</p>
                      <p className="notification-time">{notification.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-profile">
              <div className="admin-avatar">
                {adminInfo.name.charAt(0).toUpperCase()}
              </div>
              <div className="admin-info">
                <p className="admin-name">{adminInfo.name}</p>
                <p className="admin-role">{adminInfo.role}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-content">
          <ul className="admin-nav-menu">
            <li className="admin-nav-item">
              <a
                href="#"
                className={`admin-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleTabChange('dashboard')}
              >
                <FaTachometerAlt className="admin-nav-icon" />
                Dashboard
              </a>
            </li>
            <li className="admin-nav-item">
              <a
                href="#"
                className={`admin-nav-link ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => handleTabChange('products')}
              >
                <FaShoppingBag className="admin-nav-icon" />
                Products
              </a>
            </li>
            <li className="admin-nav-item">
              <a
                href="#"
                className={`admin-nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => handleTabChange('orders')}
              >
                <FaClipboardList className="admin-nav-icon" />
                Orders
              </a>
            </li>
            <li className="admin-nav-item">
              <a
                href="#"
                className={`admin-nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => handleTabChange('users')}
              >
                <FaUsers className="admin-nav-icon" />
                Users
              </a>
            </li>
            <li className="admin-nav-item">
              <a
                href="#"
                className={`admin-nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => handleTabChange('analytics')}
              >
                <FaChartLine className="admin-nav-icon" />
                Analytics
              </a>
            </li>
            <li className="admin-nav-item">
              <a
                href="#"
                className={`admin-nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => handleTabChange('settings')}
              >
                <FaCog className="admin-nav-icon" />
                Settings
              </a>
            </li>
            <li className="admin-nav-item" style={{ marginTop: '2rem' }}>
              <a
                href="#"
                className="admin-nav-link"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="admin-nav-icon" />
                Logout
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <>
              <div className="admin-header">
                <h1 className="admin-title">Dashboard</h1>
                <p className="admin-subtitle">Welcome back, {adminInfo.name}. Here's what's happening with your store.</p>
              </div>

              {/* Statistics Cards */}
              <div className="admin-stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon">
                      <FaShoppingBag />
                    </div>
                  </div>
                  <h3 className="stat-value">{stats.totalProducts}</h3>
                  <p className="stat-label">Total Products</p>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon">
                      <FaUsers />
                    </div>
                  </div>
                  <h3 className="stat-value">{stats.totalUsers}</h3>
                  <p className="stat-label">Total Users</p>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon">
                      <FaClipboardList />
                    </div>
                  </div>
                  <h3 className="stat-value">{stats.totalOrders}</h3>
                  <p className="stat-label">Total Orders</p>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon">
                      <FaChartLine />
                    </div>
                  </div>
                  <h3 className="stat-value">₹{stats.revenue.toLocaleString()}</h3>
                  <p className="stat-label">Total Revenue</p>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="admin-tabs">
                <div className="admin-tab-header">
                  <button className="admin-tab-button active">Recent Orders</button>
                  <button className="admin-tab-button">Top Products</button>
                  <button className="admin-tab-button">User Growth</button>
                </div>
                <div className="admin-tab-content">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Products</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>#ORD-001</td>
                        <td>John Doe</td>
                        <td>3 items</td>
                        <td>₹1,299</td>
                        <td><span className="badge bg-success">Delivered</span></td>
                        <td>2024-01-15</td>
                      </tr>
                      <tr>
                        <td>#ORD-002</td>
                        <td>Jane Smith</td>
                        <td>2 items</td>
                        <td>₹899</td>
                        <td><span className="badge bg-warning">Processing</span></td>
                        <td>2024-01-14</td>
                      </tr>
                      <tr>
                        <td>#ORD-003</td>
                        <td>Mike Johnson</td>
                        <td>1 item</td>
                        <td>₹599</td>
                        <td><span className="badge bg-info">Shipped</span></td>
                        <td>2024-01-13</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'products' && (
            <>
              <div className="admin-header">
                <h1 className="admin-title">Products Management</h1>
                <p className="admin-subtitle">Manage your product catalog, inventory, and pricing.</p>
              </div>

              <ShowProducts />
            </>
          )}

          {activeTab === 'orders' && (

            <>
              <div className="admin-header">
                <h1 className="admin-title">Orders Management</h1>
                <p className="admin-subtitle">Track and manage customer orders, shipping, and returns.</p>
              </div>

              <div className="admin-tabs">
                {<OrdersTab />
                }

              </div>
            </>
          )}

          {activeTab === 'users' && (
            <>
              <div className="admin-header">
                <h1 className="admin-title">User Management</h1>
                <p className="admin-subtitle">Manage customer accounts, permissions, and user data.</p>
              </div>

              <div className="admin-tabs">
                <div className="admin-tab-header">
                  <button className="admin-tab-button active">All Users</button>
                  <button className="admin-tab-button">Active Users</button>
                  <button className="admin-tab-button">User Analytics</button>
                </div>
                <div className="admin-tab-content">
                  <p>User management interface will be implemented here.</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <div className="admin-header">
                <h1 className="admin-title">Analytics & Reports</h1>
                <p className="admin-subtitle">Detailed insights into your store performance and customer behavior.</p>
              </div>

              <div className="admin-tabs">
                <div className="admin-tab-header">
                  <button className="admin-tab-button active">Sales Analytics</button>
                  <button className="admin-tab-button">User Analytics</button>
                  <button className="admin-tab-button">Product Analytics</button>
                  <button className="admin-tab-button">Reports</button>
                </div>
                <div className="admin-tab-content">
                  <p>Analytics and reporting interface will be implemented here.</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <div className="admin-header">
                <h1 className="admin-title">Settings & Configuration</h1>
                <p className="admin-subtitle">Configure your store settings, payment methods, and preferences.</p>
              </div>

              <div className="admin-tabs">
                <div className="admin-tab-header">
                  <button className="admin-tab-button active">General Settings</button>
                  <button className="admin-tab-button">Payment Settings</button>
                  <button className="admin-tab-button">Shipping Settings</button>
                  <button className="admin-tab-button">Security</button>
                </div>
                <div className="admin-tab-content">
                  <p>Settings and configuration interface will be implemented here.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default AdminPanel;