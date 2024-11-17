import React, { useContext, useEffect, useState } from "react";
import ShowProducts from "./ShowProducts";
import CreateProduct from "./CreateProduct";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MyContext } from '../Contexts/AllContext'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("show");
  const navigate = useNavigate()
  const { product, setproduct } = useContext(MyContext)

  const isAdmin = async () => {
    try {
      let product = await axios.get("http://localhost:3000/product/allproducts", { withCredentials: true })
      setproduct(product.data.products)
    } catch (error) {
      navigate("/")
      console.log(error)
    }
  }

  useEffect(() => {
    isAdmin()
  }, [])


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