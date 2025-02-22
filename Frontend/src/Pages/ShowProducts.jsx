import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Contexts/AllContext";
import { LuPlus } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import axios from 'axios'
import { API } from '../Contexts/AllContext'

const ShowProducts = () => {
    const { product } = useContext(MyContext);

    const handleDeleteProduct = async (e) => {
        try {
            await axios.delete(`${API}/product/deleteproduct/${e._id}`, { withCredentials: true })
            alert("Product Deleted Successfully!!")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="">
            <h2 className=" text-center m-3 fw-bold">All Producsts</h2>
            <div className="row justify-content-center gap-3">
                {product.map((e, index) => (
                    <div
                        key={index}
                        className="col-4 p-0 rounded border"
                        style={{
                            height: "250px",
                            backgroundColor: e.bgColor,
                            boxShadow: `1px 5px 10px ${e.bgColor}`,
                        }}
                    >
                        <div className="col-12">
                            <img
                                className="col-12"
                                style={{ height: "170px", objectFit: "cover" }}
                                src={e.image}
                                alt={e.name}
                            />
                        </div>
                        <div className="col-12 p-3 d-flex" style={{ backgroundColor: e.panelColor }}>
                            <div className="col-9" style={{ color: e.textColor }}>
                                <h5 className="fw-lighter">{e.name}</h5>
                                <h6 style={{ marginTop: "-8px" }}>${e.price}</h6>
                            </div>
                            <div className="col-4 text-end d-flex gap-3">
                                <MdDelete className="fs-3 rounded-pill p-1" style={{ color: e.textColor, border: `1px solid ${e.textColor}`, cursor: 'pointer' }} onClick={() => handleDeleteProduct(e)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowProducts;
