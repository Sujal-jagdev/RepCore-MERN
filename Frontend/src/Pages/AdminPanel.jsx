import React, { useState } from "react";
import ShowProducts from "./ShowProducts";
import CreateProduct from "./CreateProduct";
// import "bootstrap/dist/css/bootstrap.min.css"; // Make sure you have Bootstrap in your project

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("show");

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-light text-dark p-3" style={{ width: "250px" }}>
        <h4 className="text-center">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a
              className={`nav-link text-dark ${activeTab === "show" ? "active" : ""}`}
              href="#"
              onClick={() => setActiveTab("show")}
            >
              Show Products
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link text-dark ${activeTab === "create" ? "active" : ""}`}
              href="#"
              onClick={() => setActiveTab("create")}
            >
              Create Product
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content p-4" style={{ flex: 1 }}>
        {activeTab === "show" ? <ShowProducts /> : <CreateProduct />}
      </div>
    </div>
  );
};

export default AdminPanel;