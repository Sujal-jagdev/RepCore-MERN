import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getData, HLPrice, LHPrice } from '../Redux/ProductSortSlice';
import { Link } from 'react-router-dom';
import Sidebar from './SideBar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ProductsPageSkeleton from '../Components/Loader';

const Mens = () => {
  // CSS styles for product cards and UI components
  // const styles = {
  //   productCard: {
  //     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  //     cursor: 'pointer',
  //     borderRadius: '16px',
  //     overflow: 'hidden',
  //     backgroundColor: '#ffffff',
  //     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  //     border: '1px solid rgba(229, 231, 235, 0.5)',
  //     position: 'relative',
  //     width: '320px',
  //     minWidth: '280px',
  //     maxWidth: '380px',
  //     // Hover effects
  //     '&:hover': {
  //       transform: 'translateY(-8px) scale(1.02)',
  //       boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  //       borderColor: 'rgba(99, 102, 241, 0.3)',
  //     },
  //     '&:hover .product-img': {
  //       transform: 'scale(1.1)',
  //     },
  //     '&:hover .product-overlay': {
  //       opacity: 1,
  //     },
  //     '&:active': {
  //       transform: 'translateY(-4px) scale(1.01)',
  //     }
  //   },

  //   productImgContainer: {
  //     overflow: 'hidden',
  //     position: 'relative',
  //     borderRadius: '12px 12px 0 0',
  //     aspectRatio: '4/3',
  //     background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
  //   },

  //   productImg: {
  //     width: '100%',
  //     height: '100%',
  //     objectFit: 'cover',
  //     transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  //     filter: 'brightness(1) saturate(1)',
  //     className: 'product-img',
  //   },

  //   productOverlay: {
  //     position: 'absolute',
  //     top: 0,
  //     left: 0,
  //     width: '100%',
  //     height: '100%',
  //     background: '#55555534',
  //     opacity: 0,
  //     transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  //     display: 'flex',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     backdropFilter: 'blur(2px)',
  //     className: 'product-overlay',
  //   },

  //   // Additional elements for complete card styling
  //   productContent: {
  //     padding: '20px',
  //     background: '#ffffff',
  //   },

  //   productTitle: {
  //     fontSize: '18px',
  //     fontWeight: '600',
  //     color: '#1f2937',
  //     marginBottom: '8px',
  //     lineHeight: '1.4',
  //     transition: 'color 0.3s ease',
  //   },

  //   productPrice: {
  //     fontSize: '20px',
  //     fontWeight: '700',
  //     color: '#059669',
  //     marginBottom: '4px',
  //   },

  //   productOriginalPrice: {
  //     fontSize: '14px',
  //     color: '#9ca3af',
  //     textDecoration: 'line-through',
  //     marginLeft: '8px',
  //   },

  //   productDescription: {
  //     fontSize: '14px',
  //     color: '#6b7280',
  //     lineHeight: '1.5',
  //     marginBottom: '12px',
  //     display: '-webkit-box',
  //     WebkitLineClamp: 2,
  //     WebkitBoxOrient: 'vertical',
  //     overflow: 'hidden',
  //   },

  //   productBadge: {
  //     position: 'absolute',
  //     top: '12px',
  //     right: '12px',
  //     backgroundColor: '#ef4444',
  //     color: '#ffffff',
  //     fontSize: '12px',
  //     fontWeight: '600',
  //     padding: '4px 8px',
  //     borderRadius: '20px',
  //     textTransform: 'uppercase',
  //     letterSpacing: '0.5px',
  //     zIndex: 2,
  //   },

  //   productRating: {
  //     display: 'flex',
  //     alignItems: 'center',
  //     gap: '4px',
  //     marginBottom: '8px',
  //   },

  //   productStar: {
  //     color: '#fbbf24',
  //     fontSize: '14px',
  //   },

  //   productRatingText: {
  //     fontSize: '14px',
  //     color: '#6b7280',
  //     marginLeft: '4px',
  //   },

  //   // Quick action buttons in overlay
  //   overlayActions: {
  //     display: 'flex',
  //     gap: '12px',
  //   },

  //   overlayButton: {
  //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
  //     border: 'none',
  //     borderRadius: '50%',
  //     width: '44px',
  //     height: '44px',
  //     display: 'flex',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     cursor: 'pointer',
  //     transition: 'all 0.3s ease',
  //     backdropFilter: 'blur(10px)',
  //     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  //     '&:hover': {
  //       backgroundColor: '#ffffff',
  //       transform: 'scale(1.1)',
  //     }
  //   },

  //   // Responsive variants
  //   '@media (max-width: 768px)': {
  //     productCard: {
  //       width: '100%',
  //       maxWidth: '300px',
  //       minWidth: '250px',
  //       '&:hover': {
  //         transform: 'translateY(-4px)',
  //       }
  //     },
  //     productContent: {
  //       padding: '16px',
  //     },
  //     productTitle: {
  //       fontSize: '16px',
  //     },
  //     productPrice: {
  //       fontSize: '18px',
  //     }
  //   }
  // };

  const dispatch = useDispatch();
  const [pagination, setpagination] = useState(1)

  let { products, loading, error } = useSelector((state) => state.Product);
  const MenArr = [
    "T-shirts",
    "Tank Tops",
    "Hoodies & Sweatshirts",
    "Shorts",
    "Joggers",
    "Compression Wear",
    "Jackets",
    "Gym Bags",
    "Gloves",
    "Belts",
    "Straps & Wraps",
    "Socks",
    "Caps",
    "Bottles & Shakers"
  ];

  useEffect(() => {
    dispatch(getData({ route: 'mensproducts', page: pagination }))
  }, [pagination]);

  if (loading) {
    return <ProductsPageSkeleton />
  }
  if (error || !products) {
    console.log(error)
    return <div className="text-center mt-5 pt-5 text-danger">Product not found!</div>;
  }

  // Custom CSS for hover effects
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

  return (
    <div className="mens-page">

      <div className=' position-relative col-12 mt-5 mt-sm-1 mt-md-0 mt-lg-0'>
        <img src="https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fwl6q2in9o7k3%2F1iuIbb3aa6xrFlg9gtxi5Z%2F1385a8fbe16b1e4c4b657fd4a6776041%2FSTL_Desktop_mens.jpg&w=1664&q=85" alt="" className='col-12 w-100' />
        <div className=' position-absolute top-50 ms-5 d-none d-sm-block d-md-block d-lg-block'>
          <h1 className=' fw-bolder text-light'>Best Sellers</h1>
          <h6 className=' fw-bold text-light'>Comfortable, reliable, and loved by gym lovers.</h6>
        </div>
      </div>

      <div className=' col-12 p-2 d-block d-sm-none d-md-none d-lg-none'>
        <h1 className=' fw-bolder '>Best Sellers</h1>
        <h6 className=' fw-bold '>Comfortable, reliable, and loved by gym lovers.</h6>
      </div>

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
          <Sidebar items={MenArr} />
        </div>
      </div>

      <div className='mt-3 col-12 d-flex flex-wrap'>
        <div className='col-md-4 col-lg-3 mt-4 position-relative d-none d-sm-none d-md-block d-lg-block'>
          <Sidebar items={MenArr} />
        </div>
        <div className='p-lg-4 p-md-4 p-sm-4 p-0 ms-sm-0 ms-md-0 ms-lg-0 d-flex flex-wrap col-12 col-sm-12 col-md-8 col-lg-9'>
          {
            products.map((e) => (
              <Link to={`/product/${e._id}`} className='p-sm-2 p-md-2 p-lg-2 col-6 col-sm-6 col-md-6 col-lg-4 text-decoration-none text-dark' key={e._id}>
                <div className="product-card h-100 rounded overflow-hidden shadow-sm"

                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  <div className='product-img-container position-relative overflow-hidden' >
                    <img src={e.image} alt={e.name} className='img-fluid w-100 product-img' />
                    <div className="product-overlay d-flex justify-content-center align-items-center">
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
  );
};

export default Mens;
