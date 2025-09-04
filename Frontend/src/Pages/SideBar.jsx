import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, HLPrice, LHPrice, sortbyColor, sorting } from "../Redux/ProductSortSlice";

const Sidebar = ({ items }) => {
  const dispatch = useDispatch();
  const [activeType, setActiveType] = useState(null);
  const [activeColor, setActiveColor] = useState(null);

  const SortProduct = (item) => {
    setActiveType(item);
    dispatch(sorting(item));
  };

  const SortProductByColor = (color) => {
    setActiveColor(color);
    dispatch(sortbyColor(color));
  };

  return (
    <>
      <div
        className="col-12 p-3 bg-light border rounded shadow-sm position-sticky top-0"
        style={{
          height: "100vh",
          overflowY: "auto",
          paddingRight: "10px",
        }}
      >
        <h5 className="mb-3 fw-bolder d-flex align-items-center">
          <i className="bi bi-funnel-fill me-2"></i>
          Sort By
        </h5>
        <div className="mb-3">
          <button
            className="btn btn-outline-dark w-100 mb-2 d-flex align-items-center justify-content-between"
            onClick={() => dispatch(HLPrice())}
            data-bs-dismiss="offcanvas" aria-label="Close"
          >
            <span>Price: High to Low</span>
            <i className="bi bi-arrow-down"></i>
          </button>
          <button
            className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-between"
            onClick={() => dispatch(LHPrice())}
            data-bs-dismiss="offcanvas" aria-label="Close"
          >
            <span>Price: Low to High</span>
            <i className="bi bi-arrow-up"></i>
          </button>
        </div>

        <hr />

        <h5 className="mb-3 fw-bolder mt-4 d-flex align-items-center">
          <i className="bi bi-tags-fill me-2"></i>
          Product Type
        </h5>
        <div className="product-type-container">
          {items.map((item, index) => (
            <div 
              key={index}
              className={`product-type-item mb-2 p-3 rounded ${activeType === item ? 'bg-dark text-white' : 'bg-light'}`}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onClick={() => SortProduct(item)}
              data-bs-dismiss="offcanvas" aria-label="Close"
            >
              <div className="d-flex align-items-center justify-content-between">
                <span style={{ fontSize: '0.95rem' }}>{item}</span>
                {activeType === item && <i className="bi bi-check-circle-fill"></i>}
              </div>
            </div>
          ))}
        </div>

        <hr />

        <h5 className="mb-3 fw-bolder mt-4 d-flex align-items-center">
          <i className="bi bi-palette-fill me-2"></i>
          Color
        </h5>
        <div className="d-flex flex-wrap">
          {["blue", "black", "white", "brown", "green", "pink", "gray", "purple", "red"].map((color, index) => (
            <div key={index} className="m-1 position-relative">
              <button
                className={`btn rounded-circle ${activeColor === color ? 'border-3 border-dark' : 'border'}`}
                onClick={() => SortProductByColor(color)}
                style={{ 
                  backgroundColor: color, 
                  width: "40px", 
                  height: "40px",
                  transition: 'all 0.2s ease',
                  transform: activeColor === color ? 'scale(1.1)' : 'scale(1)'
                }}
                data-bs-dismiss="offcanvas" aria-label="Close"
              >
                {activeColor === color && (
                  <span className="position-absolute top-50 start-50 translate-middle">
                    <i className="bi bi-check-lg" style={{ color: ['white', 'yellow', 'pink'].includes(color) ? 'black' : 'white' }}></i>
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
