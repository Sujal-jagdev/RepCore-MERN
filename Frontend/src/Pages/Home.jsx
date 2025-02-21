import React from 'react'
import '../Style/Home.css'
import { Link } from 'react-router-dom'
import { categories, products, shopCategories, Swipper } from '../Components/Sections'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Home = () => {

  return (
    <div>

      <div className="banner-container mt-3">
        <h2 className="banner-text">
          Outfit Your Fitness Goals with Premium Gym Gear
        </h2>
        <div className="button-group">
          <Link className='text-decoration-none text-dark' to={'/womens'}><button className="btn-custom">Shop Womens</button></Link>
          <Link className='text-decoration-none text-dark' to={'/mens'}><button className="btn-custom">Shop Mens</button></Link>
        </div>
      </div>

      <section className="landing-page">
        <div className="overlay d-flex align-items-center">
          <div className="container text-white text-md-start text-center">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="fw-bold">WORKOUT SHIRTS<br />YOU’LL WANT TO LIVE IN</h1>
                <p className="mt-3">For repping, running, resting, everything.</p>
                <Link to={'/mens'}><button className="ShopNowBtn btn border border-2 rounded btn-lg mt-3 ">SHOP NOW</button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="category-section py-5">
        <div className="container-fluid">
          <h1>THE PERFECT TOP FOR EVERY WORKOUT</h1>
          <div className="row g-4">
            {categories.map((category, index) => (
              <div className="col-lg-4 col-md-4 col-sm-12" key={index}>
                <div className="category-card position-relative">
                  <img src={category.img} alt={category.title} className="img-fluid rounded" />
                  <div className="category-overlay d-flex flex-column justify-content-center align-items-center">
                    <h3 className="text-white fw-bold mb-3">{category.title}</h3>
                    <Link to={'/mens'}><button className="btn btn-outline-light btn-lg">SHOP NOW</button></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="recommendation-section text-white py-5 bg-dark">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
              <h2 className="fw-bold">WELCOME TO YOUR EDIT</h2>
              <p className="lead">Check out these products we've selected just for you.</p>
              <button className="btn btn-light btn-lg mt-3 hover-effect rounded-pill fw-bolder">SEE YOUR RECOMMENDATIONS</button>
            </div>
            <div className="col-lg-6 d-flex justify-content-center gap-4">
              {products.map((product, index) => (
                <div key={index} className="product-card border rounded bg-white p-2">
                  <img src={product.img} alt={product.alt} className="img-fluid rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white p-4 md:p-6 mt-5">
        <h1 className="text-xl font-bold mb-4">POPULAR RIGHT NOW</h1>
        <hr className="mb-4" />
        <Swiper
          spaceBetween={15}
          slidesPerView={1} // Default for small screens
          breakpoints={{
            576: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {Swipper.map((product, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 md:h-52 object-cover"
                />
                <Link to="/womens" className="text-dark">
                  <div className="p-2">
                    <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <section className="shop-section py-5">
        <div className="container-fluid">
          <div className="row">
            {shopCategories.map((category, index) => (
              <div key={index} className="col-md-4 d-flex flex-column align-items-center mb-4">
                <div className="shop-card">
                  <Link to={
                    category.label == "SHOP WOMEN" ? '/womens' : category.label == "SHOP MEN" ? '/mens' : '/accessories'
                  }>
                    <img
                      src={category.img}
                      alt={category.alt}
                      className="img-fluid rounded shadow-sm"
                    />
                  </Link>
                </div>
                <h3 className="mt-3 fw-bold text-center">{category.label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home