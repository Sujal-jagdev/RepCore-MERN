import React from "react";

// Mock Data for Products
const products = [
    {
        id: 1,
        name: "Tshirt",
        price: "₹1200",
        bgColor: "#f1c40f",
        panelColor: "#e74c3c",
    },
    {
        id: 2,
        name: "T Shirt",
        price: "₹1200",
        bgColor: "#f1c40f",
        panelColor: "#e74c3c",
    },
];

const ShowProducts = () => {
    return (
        <div className="my-5">
            <div className="row justify-content-center">
                {products.map((product) => (
                    <div className="col-6 col-md-3 mb-4" key={product.id}>
                        <div
                            className="d-flex flex-column align-items-center justify-content-between"
                            style={{
                                width: "200px",
                                height: "250px",
                                backgroundColor: product.bgColor,
                                borderRadius: "8px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    width: "100%",
                                }}
                            ></div>
                            <div
                                className="w-100 text-center"
                                style={{
                                    backgroundColor: product.panelColor,
                                    padding: "10px 0",
                                    color: "#fff",
                                    fontWeight: "bold",
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "1rem",
                                    }}
                                >
                                    {product.name}
                                </p>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "1rem",
                                    }}
                                >
                                    {product.price}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowProducts;
