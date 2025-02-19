import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import { useDispatch, useSelector } from "react-redux";
import { getData, HLPrice, LHPrice } from '../Redux/ProductSortSlice';
import { Link } from 'react-router-dom';
import Sidebar from './SideBar';
import Footer from '../Components/Footer';

const Womens = () => {

  const dispatch = useDispatch();
  const [pagination, setpagination] = useState(1)


  let { products, loading, error } = useSelector((state) => state.Product);
  const WomenArr = ["Bras", "Women Joggers", "Women Hoodie", 'Leggings', 'Short Leggings', 'T-shirt']

  useEffect(() => {
    dispatch(getData({ route: 'womensproducts', page: pagination }))
  }, [pagination]);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }
  if (error || !products) {
    return <div className="text-center mt-5 text-danger">Product not found!</div>;
  }

  return (
    <div>

      <div className=' position-relative col-12 mt-4 mt-sm-1 mt-md-0 mt-lg-0'>
        <img src="https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fwl6q2in9o7k3%2F1RIRvNcYBOQ79f5h4KF46j%2Faf54c802a061c1a82bc47632e6b808c3%2FDESKTOP.png&w=1664&q=85" alt="" className='col-12 w-100' />
        <div className=' position-absolute top-50 ms-5 d-none d-sm-block d-md-block d-lg-block'>
          <h1 className=' fw-bolder'>Best Sellers</h1>
          <h6 className=' fw-bold'>Comfortable, reliable, and loved by gym lovers.</h6>
        </div>
      </div>

      <div className=' col-12 p-2 d-block d-sm-none d-md-none d-lg-none'>
        <h1 className=' fw-bolder'>Best Sellers</h1>
        <h6 className=' fw-bold'>Comfortable, reliable, and loved by gym lovers.</h6>
      </div>

      <div className=' col-12 d-lg-none d-md-none d-flex justify-content-evenly mt-sm-3'>
        <button className=' btn border border-1 border-success text-success m-1 col-sm-4' onClick={() => dispatch(HLPrice())}>High To Low</button>
        <button className=' btn border border-1 border-danger text-danger m-1 col-sm-4' onClick={() => dispatch(LHPrice())}>Low To High</button>
        <button className=' btn border border-1 border-primary text-primary m-1 col-sm-3' type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Filters</button>
      </div>

      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
          <h3 id="offcanvasRightLabel">More Fillters</h3>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <Sidebar items={WomenArr} />
        </div>
      </div>

      <div className='mt-3 col-12 d-flex flex-wrap'>
        <div className='col-md-4 col-lg-3 mt-4 position-relative d-none d-sm-none d-md-block d-lg-block'>
          <SideBar items={WomenArr} />
        </div>
        <div className='p-lg-4 p-md-4 p-sm-4 p-0 ms-2 ms-sm-0 ms-md-0 ms-lg-0 d-flex flex-wrap col-12 col-sm-12 col-md-8 col-lg-9'>
          {
            products.map((e) => (
              <Link to={`/description/${e._id}`} className='p-2 p-sm-0 p-md-0 p-lg-0 col-6 col-sm-6 col-md-6 col-lg-4 text-decoration-none text-dark' key={e._id}>
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
          <div className=' d-flex col-12 justify-content-center gap-3' style={{ height: '50px' }}>
            <button className=' btn border border-1 border-danger text-danger' disabled={pagination == 1} onClick={() => setpagination(pagination - 1)}>Previos</button>
            <button className=' btn border border-1 border-primary text-primary' disabled={products.length < 10} onClick={() => setpagination(pagination + 1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Womens;
