import React, { useEffect, useState } from 'react'
import Sidebar from './SideBar'
import { useDispatch, useSelector } from 'react-redux';
import { getData, HLPrice, LHPrice } from '../Redux/ProductSortSlice';
import { Link } from 'react-router-dom';

const Accessories = () => {

  const dispatch = useDispatch();
  const [pagination, setpagination] = useState(1)

  let { products, loading, error } = useSelector((state) => state.Product);
  let AccessoriesArr = ["Socks", "Bags", "Straps", "Bottle", "Cap"];

  useEffect(() => {
    dispatch(getData({ route: 'accessories', page: pagination }))
  }, [pagination]);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }
  if (error || !products) {
    return <div className="text-center mt-5 text-danger">Product not found!</div>;
  }

  return (
    <>
      <div className=" container-fluid mt-5 pt-3">
        <div className="row">
          <div className="col-12">
            <h1 className="fw-bold">ALL ACCESSORIES</h1>
            <p className="text-muted">All roducts</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <p className="lead fs-6 fs-md-5">
              No gym 'fit is complete without accessories. For the little things
              that can make all the difference to your training, browse our range
              of gym accessories and essentials designed to keep you prepped for
              any workout. From kit bags and wash bags, to crew socks and caps,
              water bottles and shakers, and even your trusty lifting belt -
              because how can you do gym without them?
            </p>
          </div>
        </div>
      </div>

      <hr />

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
          <Sidebar items={AccessoriesArr} />
        </div>
      </div>

      <div className='mt-3 col-12 d-flex flex-wrap'>
        <div className='col-md-4 col-lg-3 mt-4 position-relative d-none d-sm-none d-md-block d-lg-block'>
          <Sidebar items={AccessoriesArr} />
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
    </>
  )
}

export default Accessories