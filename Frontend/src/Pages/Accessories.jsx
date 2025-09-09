import React, { useEffect, useState } from 'react'
import Sidebar from './SideBar'
import { useDispatch, useSelector } from 'react-redux';
import { getData, HLPrice, LHPrice } from '../Redux/ProductSortSlice';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ProductsPageSkeleton from '../Components/Loader';

const Accessories = () => {

  const dispatch = useDispatch();
  const [pagination, setpagination] = useState(1)

  let { products, loading, error } = useSelector((state) => state.Product);
  let AccessoriesArr = [
    "Gym Gloves",
    "Weight Lifting Belt",
    "Wrist Wraps",
    "Resistance Bands",
    "Shaker Bottle",
    "Gym Bag",
    "Foam Roller",
    "Jump Rope",
    "Water Bottle",
    "Smartwatch/Fitness Tracker"
  ]

  // Handlers for hover effects
  const handleMouseEnter = (e) => {
    const card = e.currentTarget;
    const overlay = card.querySelector('.product-overlay');
    const img = card.querySelector('.product-img');

    if (overlay) {
      overlay.style.opacity = '1';                // full visible
      overlay.style.background = 'rgba(0,0,0,0.1)'; // 👈 dark bg (change color here)
    }
    if (img) {
      img.style.transform = 'scale(1.05)';
      img.style.filter = 'blur(3px)'; // 👈 blur
    }
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    const overlay = card.querySelector('.product-overlay');
    const img = card.querySelector('.product-img');

    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.background = 'rgba(0,0,0,0)'; // 👈 reset bg
    }
    if (img) {
      img.style.transform = 'scale(1)';
      img.style.filter = 'blur(0px)';
    }
  };

  useEffect(() => {
    dispatch(getData({ route: 'accessories', page: pagination }))
  }, [pagination]);

    if (loading) {
    return <ProductsPageSkeleton />
  }
  if (error || !products) {
    console.log(error)
    return <div className="text-center mt-5 pt-5 text-danger">Product not found!</div>;
  }

  return (
    <div className="accessories-page">
      <div className=" container-fluid mt-5 pt-5">
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

      <div className='col-12 d-lg-none d-md-none d-flex justify-content-evenly mt-sm-3 px-2'>
        <button className='btn btn-outline-success m-1 col-sm-4 d-flex align-items-center justify-content-center gap-2' style={{ height: '40px' }} onClick={() => dispatch(HLPrice())}>
          <i className="bi bi-arrow-down"></i> <span className="d-none d-sm-inline">High To Low</span>
        </button>
        <button className='btn btn-outline-danger m-1 col-sm-4 d-flex align-items-center justify-content-center gap-2' style={{ height: '40px' }} onClick={() => dispatch(LHPrice())}>
          <i className="bi bi-arrow-up"></i> <span className="d-none d-sm-inline">Low To High</span>
        </button>
        <button className='btn btn-outline-primary m-1 col-sm-3 d-flex align-items-center justify-content-center gap-2' style={{ height: '40px' }} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
          <i className="bi bi-funnel"></i> <span className="d-none d-sm-inline">Filters</span>
        </button>
      </div>

      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header border-bottom">
          <h3 id="offcanvasRightLabel" className="d-flex align-items-center">
            <i className="bi bi-sliders me-2"></i>
            Filters & Sort
          </h3>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0">
          <Sidebar items={AccessoriesArr} />
        </div>
      </div>

      <div className='mt-3 col-12 d-flex flex-wrap'>
        <div className='col-md-4 col-lg-3 mt-4 position-relative d-none d-sm-none d-md-block d-lg-block'>
          <Sidebar items={AccessoriesArr} />
        </div>
        <div className='p-lg-4 p-md-4 p-sm-4 p-0 ms-sm-0 ms-md-0 ms-lg-0 d-flex flex-wrap col-12 col-sm-12 col-md-8 col-lg-9'>
          {
            products.map((e) => (
              <Link to={`/product/${e._id}`} className='p-sm-2 p-md-2 p-lg-2 col-6 col-sm-6 col-md-6 col-lg-4 text-decoration-none text-dark' key={e._id}>
                <div className="product-card h-100 rounded overflow-hidden shadow-sm"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  <div className='product-img-container position-relative overflow-hidden'>
                    <img src={e.image} alt={e.name} className='img-fluid w-100 product-img' />
                    <div className="product-overlay d-flex justify-content-center align-items-center" >
                      <button className="btn btn-sm btn-light rounded-circle me-2">
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-light rounded-circle">
                        <i className="bi bi-heart"></i>
                      </button>
                    </div>
                  </div>
                  <div className='product-info p-3'>

                    <h6 className="product-title fw-bold mb-2" style={{ fontSize: '0.85rem', lineHeight: '1.2' }}>{e.name}</h6>
                    <div className="product-details">
                      <div className="d-flex align-items-center mb-1">
                        <span className="fw-bold me-2">${e.price}</span>
                        {e.discount && e.discount !== 0 && <span className="text-decoration-line-through text-muted">${e.discount}</span>}
                      </div>

                      {/* Additional product details */}
                      <div className="d-flex flex-wrap gap-1 mb-1">
                        {e.sizes && e.sizes.length > 0 && (
                          <div className="small text-muted me-2">
                            <i className="bi bi-rulers me-1"></i>
                            {e.sizes.join(', ')}
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        {e.reviews && (
                          <div className="small">
                            <i className="bi bi-star-fill text-warning me-1"></i>
                            <span>{e.reviews.length}</span>
                          </div>
                        )}

                        {e.stock !== undefined && (
                          <div className={`small ${e.stock > 0 ? 'text-success' : 'text-danger'}`}>
                            {e.stock > 0 ? (
                              <><i className="bi bi-check-circle me-1"></i>In Stock</>
                            ) : (
                              <><i className="bi bi-x-circle me-1"></i>Out of Stock</>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          }
          <div className='d-flex col-12 justify-content-center gap-3 my-4'>
            <button className='btn btn-outline-dark px-4 d-flex align-items-center justify-content-center' style={{ height: '40px', minWidth: '120px' }} disabled={pagination == 1} onClick={() => setpagination(pagination - 1)}>
              <i className="bi bi-chevron-left me-2"></i> Previous
            </button>
            <div className="pagination-info d-flex align-items-center justify-content-center px-3 rounded bg-light" style={{ height: '40px', minWidth: '80px' }}>
              <span>Page {pagination}</span>
            </div>
            <button className='btn btn-dark px-4 d-flex align-items-center justify-content-center' style={{ height: '40px', minWidth: '120px' }} disabled={products.length < 10} onClick={() => setpagination(pagination + 1)}>
              Next <i className="bi bi-chevron-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Accessories