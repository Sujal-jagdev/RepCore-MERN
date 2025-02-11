import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetCartProduct, RemoveingCartProduct } from '../Redux/AddToCartSlice';
import { useNavigate } from 'react-router-dom';
import { GetallProduct, GetProductFromID } from '../Redux/AllProductSlice';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [productCount, setproductCount] = useState(() => {
        return JSON.parse(localStorage.getItem("cartCounts")) || {};
    })

    const { cartData, loading, error } = useSelector((state) => state.AddToCart);
    const GetProducts = useSelector((state) => state.GetAllProduct);

    useEffect(() => {
        dispatch(GetallProduct());
    }, [dispatch]);

    const HandleGetCartProduct = () => {
        dispatch(GetCartProduct()).then((res) => {
            if (res.payload) {
                const uniqueProductIDs = [...new Set(res.payload)];
                dispatch(GetProductFromID(uniqueProductIDs));
            }
        });
    }

    useEffect(() => {
        HandleGetCartProduct()
    }, [dispatch]);

    const increaseCount = (id) => {
        setproductCount((prev) => ({
            ...prev,
            [id]: (prev[id] || 1) + 1, // If no value, start from 1
        }));
    };

    const DecreaseCount = (id) => {
        setproductCount((prev) => ({
            ...prev,
            [id]: (prev[id] || 1) - 1, // If no value, start from 1
        }));
    };

    useEffect(() => {
        localStorage.setItem("cartCounts", JSON.stringify(productCount));
    }, [productCount]);

    useEffect(() => {
        if (error || GetProducts.error) {
            navigate("/login");
        }
    }, [error, GetProducts.error, navigate]);

    // Remove duplicate products
    const uniqueProducts = GetProducts.product?.filter(
        (product, index, self) => index === self.findIndex((p) => p._id === product._id)
    );

    if (loading || GetProducts.loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status"></div>
            </div>
        );
    }

    const HandleRemoveProduct = (id) => {
        let res = dispatch(RemoveingCartProduct(id))
        res.then((e) => alert("Product Removed From Cart SucessFully"))
    }

    return (
        <div>
            <h2 className='text-center m-3 fw-bold'>Your Cart Products</h2>
            <div className='p-3 d-flex flex-column align-items-center col-12'>
                {uniqueProducts?.map((e) => (
                    <div className='row col-lg-10 col-12 border rounded p-2 mb-2 shadow-sm' key={e._id}>
                        <div className='col-3 d-flex align-items-center justify-content-center'>
                            <img
                                src={e.image}
                                alt={e.name}
                                className='rounded'
                                style={{ width: '100%', height: '80px', objectFit: 'contain' }}
                            />
                        </div>
                        <div className='col-6 d-flex flex-column justify-content-center'>
                            <h6 className='fw-bold m-0'>{e.name}</h6>
                            <h6 className='text-muted m-0' style={{ fontSize: '14px' }}>
                                Price: ${e.price} <span className='text-danger'><s>${e.discount}</s></span>
                            </h6>
                            <div className='mt-1'>
                                <button className='btn btn-sm border' onClick={() => DecreaseCount(e._id)}>-</button>&nbsp;&nbsp;{productCount[e._id] || 1}&nbsp;
                                <button className='btn btn-sm border' onClick={() => increaseCount(e._id)}>+</button>
                            </div>
                        </div>
                        <div className='col-3 d-flex flex-column justify-content-center align-items-end'>
                            <h6 className='text-danger border p-2 border-danger' style={{ cursor: 'pointer', fontSize: '14px' }} onClick={() => HandleRemoveProduct(e._id)}>Remove</h6>
                        </div>
                    </div>
                ))}
                <button className='btn btn-primary mt-3 col-10'>Buy All Products</button>
            </div>
        </div>

    );
};

export default CartPage;