import React, { useEffect, useState } from 'react'
import Sidebar from './SideBar'
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../Redux/ProductSortSlice';
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
      <div className=" container-fluid mt-4">
        <div className="row">
          <div className="col-12">
            <h1 className="fw-bold">ALL ACCESSORIES</h1>
            <p className="text-muted">269 Products</p>
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

      <div className='mt-2 col-12 d-flex'>
        <div className='col-3 mt-2 position-relative'>
          <Sidebar items={AccessoriesArr} />
        </div>
        <div className='p-4 d-flex flex-wrap col-9'>
          {
            products.map((e) => (
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