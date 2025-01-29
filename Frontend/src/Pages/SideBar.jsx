import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, leggings } from "../Redux/ProductSortSlice";

const Sidebar = () => {
    const dispatch = useDispatch();
    let { products } = useSelector((state) => state.Product)
console.log(products)
    useEffect(() => {
        dispatch(getData());
    }, [dispatch]);
    return (
        <div className="col-12 p-3 bg-light border">
            <h5 className="mb-3">Sort By</h5>
            <div className="mb-3">
                <button className="btn btn-outline-primary w-100 mb-2" onClick={() => dispatch(leggings())}>Price: High to Low</button>
                <button className="btn btn-outline-primary w-100">Price: Low to High</button>
            </div>

            <h5 className="mb-3">Product Type</h5>
            <ul className="list-group mb-3">
                {['Leggings', 'Short Leggings', 'Women Joggers', 'Women Hoodie', 'Bras'].map((item, index) => (
                    <li key={index} style={{ cursor: 'pointer' }} className="list-group-item list-group-item-action">{item}</li>
                ))}
            </ul>

            <h5 className="mb-3">Color</h5>
            <div className="d-flex flex-wrap">
                {["blue", "black", "white", "brown", "green", "pink", "gray", "purple", "red"].map((color, index) => (
                    <div key={index} className="m-1">
                        <button className="btn border rounded-circle" style={{ backgroundColor: color, width: "30px", height: "30px" }}></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
