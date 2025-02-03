import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GetOneProduct } from '../Redux/GetOneProductSlice';
import { AddProductToCart } from '../Redux/AddToCartSlice';

const Description = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleProduct, loading, error } = useSelector((state) => state.GetOneProduct);
  const AddToCartResponse = useSelector((state) => state.AddToCart)

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(GetOneProduct(id));
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }
  if (error || !singleProduct) {
    return <div className="text-center mt-5 text-danger">Product not found!</div>;
  }

  const AddToCartProduct = (id) => {
    dispatch(AddProductToCart(id))
  }

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start p-3">
        <img
          src={singleProduct.image}
          alt={singleProduct.name}
          className="img-fluid rounded shadow-sm w-100 w-md-50"
          style={{ maxWidth: '400px' }}
        />
        <div className="ms-md-4 mt-3 mt-md-0">
          <h2 className="fw-bold">{singleProduct.name}</h2>
          <h5>Color: {singleProduct.bgColor}</h5>
          <h5 className="text-success">Price: ${singleProduct.price}</h5>
          <h5 className=' text-danger'>Discount: <s>${singleProduct.discount}</s></h5>
          <p className="text-muted">{singleProduct.description}</p>
          <button className="btn btn-primary px-4 mt-3" onClick={() => AddToCartProduct(singleProduct._id)}>Add To Cart</button>
        </div>
      </div>
    </div>
  )
}

export default Description  