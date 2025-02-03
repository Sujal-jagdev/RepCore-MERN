import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetCartProduct } from '../Redux/AddToCartSlice';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.AddToCart)  

    useEffect(() => {
      let res = dispatch(GetCartProduct())

    }, [dispatch])

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
    }
    if (error) {
        return <div className="text-center mt-5 text-danger">After Login You Can Acess Add To Cart Feature!</div>;
    }

    return (
        <div>

        </div>
    )
}

export default CartPage