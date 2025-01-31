import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getData, getOneProduct } from '../Redux/ProductSortSlice';

const Description = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.Product)

  useEffect(() => {
    dispatch(getData("allproducts"))
  }, [dispatch])
  useEffect(() => {
    let data = dispatch(getOneProduct(id))
    console.log(data)
  }, [dispatch])


  return (
    <div>Description</div>
  )
}

export default Description  