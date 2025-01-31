import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import { useDispatch, useSelector } from "react-redux";
import { getData } from '../Redux/ProductSortSlice';
import { Link } from 'react-router-dom';

const Womens = () => {

  const dispatch = useDispatch();

  let { products, loading, error } = useSelector((state) => state.Product)

  useEffect(() => {
    dispatch(getData('womensproducts'))
  }, [dispatch]);

  return (
    <div>

      <div className=' position-relative'>
        <img src="https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fwl6q2in9o7k3%2F1RIRvNcYBOQ79f5h4KF46j%2Faf54c802a061c1a82bc47632e6b808c3%2FDESKTOP.png&w=1664&q=85" alt="" className='col-12 w-100' />
        <div className=' position-absolute top-50 ms-5'>
          <h1 className=' fw-bolder'>Best Sellers</h1>
          <h6 className=' fw-bold'>Comfortable, reliable, and loved by gym lovers.</h6>
        </div>
      </div>

      <div className='mt-3 col-12 d-flex'>
        <div className='col-3 mt-4 position-relative'>
          <SideBar />
        </div>
        <div className='p-4 d-flex flex-wrap col-9'>
          {
            loading ? <h1 className=' text-center col-12'>Loading...</h1> : error ? <h1>Error</h1> : products.map((e) => (
              <Link to={`/description/${e._id}`} className=' col-4 text-decoration-none text-dark' key={e._id}>
                <div>
                  <div className='col-11'>
                    <img src={e.image} alt="" className='col-12' />
                  </div>
                  <div className=' mt-2'>
                    <h6 style={{ fontSize: '15px' }}>{e.name}</h6>
                    <h6>{e.bgColor}</h6>
                    <h6>Price: ${e.price} <span className=' text-danger'><s>${e.discount}</s></span></h6>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Womens;
