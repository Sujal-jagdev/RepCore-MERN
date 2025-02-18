import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, HLPrice, LHPrice, sortbyColor, sorting } from "../Redux/ProductSortSlice";

const Sidebar = ({ items }) => {
  const dispatch = useDispatch();

  const SortProduct = (item) => {
    dispatch(sorting(item));
  };

  const SortProductByColor = (color) => {
    dispatch(sortbyColor(color));
  };

  return (
    <>
      <div
        className="col-12 p-3 bg-light border position-sticky top-0"
        style={{
          height: "100vh",
          overflowY: "auto", // Enables scrolling
          paddingRight: "10px", // Optional: for better scroll handling
        }}
      >
        <h5 className="mb-3 fw-bolder">Sort By</h5>
        <div className="mb-3">
          <button
            className="btn border border-2 border-dark w-100 mb-2"
            onClick={() => dispatch(HLPrice())}
            data-bs-dismiss="offcanvas" aria-label="Close"
          >
            Price: High to Low
          </button>
          <button
            className="btn border border-2 border-dark w-100"
            onClick={() => dispatch(LHPrice())}
            data-bs-dismiss="offcanvas" aria-label="Close"
          >
            Price: Low to High
          </button>
        </div>

        <hr />

        <h5 className="mb-3 fw-bolder mt-4">Product Type</h5>
        <ul className="list-group mb-3">
          {items.map((item, index) => (
            <li
              key={index}
              style={{ cursor: 'pointer', fontSize: '18px' }}
              onClick={() => SortProduct(item)}
              className="list-group-item list-group-item-action p-3"
              data-bs-dismiss="offcanvas" aria-label="Close"
            >
              {item}
            </li>
          ))}
        </ul>

        <hr />

        <h5 className="mb-3 fw-bolder mt-4">Color</h5>
        <div className="d-flex flex-wrap">
          {["blue", "black", "white", "brown", "green", "pink", "gray", "purple", "red"].map((color, index) => (
            <div key={index} className="m-1">
              <button
                className="btn border rounded-circle"
                onClick={() => SortProductByColor(color)}
                style={{ backgroundColor: color, width: "40px", height: "40px" }}
                data-bs-dismiss="offcanvas" aria-label="Close"
              ></button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
