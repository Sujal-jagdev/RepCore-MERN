import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Contexts/AllContext";
import { LuPlus } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import axios from 'axios'

const ShowProducts = () => {
    const { product } = useContext(MyContext);
    const [productsWithImages, setProductsWithImages] = useState([]);


    const handleDeleteProduct = async (e) => {
        try {
            await axios.delete(`http://localhost:3000/product/deleteproduct/${e._id}`, { withCredentials: true })
            alert("Product Deleted Successfully!!")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const convertImages = async () => {
            const updatedProducts = await Promise.all(
                product.map((e) => {
                    const bufferData = e.image.data;
                    const blob = new Blob([new Uint8Array(bufferData)], { type: "image/jpeg" });

                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve({ ...e, base64Image: reader.result });
                        };
                        reader.readAsDataURL(blob);
                    });
                })
            );

            setProductsWithImages(updatedProducts);
        };

        convertImages();
    }, [product, handleDeleteProduct]);



    return (
        <div className="">
            <h2 className=" text-center m-3 fw-bold">All Producsts</h2>
            <div className="row justify-content-center gap-3">
                {productsWithImages.map((e, index) => (
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
                                src={e.base64Image}
                                alt={e.name}
                            />
                        </div>
                        <div className="col-12 p-3 d-flex" style={{ backgroundColor: e.panelColor }}>
                            <div className="col-9" style={{ color: e.textColor }}>
                                <h5 className="fw-lighter">{e.name}</h5>
                                <h6 style={{ marginTop: "-8px" }}>${e.price}</h6>
                            </div>
                            <div className="col-4 text-end d-flex gap-3">
                                <LuPlus className="fs-3 rounded-pill p-1" style={{ color: e.textColor, border: `1px solid ${e.textColor}`, cursor: 'pointer' }} />
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
