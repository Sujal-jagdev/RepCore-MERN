import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetCartProduct } from '../Redux/AddToCartSlice';
import { useNavigate } from 'react-router-dom';
import { GetallProduct, GetProductFromID } from '../Redux/AllProductSlice';

const CartPage = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.AddToCart)

    const GetProducts = useSelector((state) => state.GetAllProduct)

    useEffect(() => {
        dispatch(GetallProduct())
    }, [dispatch])

    useEffect(() => {
        dispatch(GetCartProduct()).then((e) => dispatch(GetProductFromID(e.payload)))
    }, [dispatch])

    if (loading || GetProducts.loading) {
        return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
    }
    if (error || GetProducts.error) {
        return <div className="text-center mt-5 text-danger">After Login You Can Acess Add To Cart Feature!</div>;
    }

    return (
        <div>
            <h2 className=' text-center m-3 fw-bold'>Your Cart Products</h2>
            <div className='p-4 d-flex flex-wrap col-12 justify-content-center   '>
                {
                    GetProducts.product.map((e) => (
                        <div className=' col-3 text-decoration-none text-dark' key={e._id}>
                            <div className='m-3'>
                                <div className='col-11'>
                                    <img src={e.image} alt="" className='col-12' />
                                </div>
                                <div className=' mt-2'>
                                    <h6 style={{ fontSize: '15px' }}>{e.name}</h6>
                                    <h6>{e.bgColor}</h6>
                                    <h6>Price: ${e.price} <span className=' text-danger'><s>${e.discount}</s></span></h6>
                                    <h6 className=' text-danger' style={{ cursor: 'pointer' }}>Remove</h6>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default CartPage;