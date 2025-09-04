import React, { useEffect, useState } from 'react'
import '../Style/Home.css'
import { Link } from 'react-router-dom'
import { categories, products, shopCategories, Swipper } from '../Components/Sections'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import bgVideo from '../assets/bg.mp4'

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all animate-on-scroll elements
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    // Cleanup
    return () => {
      animateElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="home-container">
      {/* Enhanced Hero Section with Video Background */}
      <section className="hero-section">
        <div className="hero-background">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={bgVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text-container">
              <h1 className={`hero-title ${isVisible ? 'animate-slide-up' : ''}`}>
                TRANSFORM YOUR
                <span className="highlight-text"> FITNESS JOURNEY</span>
              </h1>
              <p className={`hero-subtitle ${isVisible ? 'animate-slide-up delay-1' : ''}`}>
                Premium gym gear designed for champions. Elevate your workout experience with our cutting-edge fitness apparel.
              </p>
              <div className={`hero-buttons ${isVisible ? 'animate-slide-up delay-2' : ''}`}>
                <Link to={'/womens'} className="hero-btn primary-btn">
                  <span>Shop Women's</span>
                  <i className="arrow-icon">→</i>
                </Link>
                <Link to={'/mens'} className="hero-btn secondary-btn">
                  <span>Shop Men's</span>
                  <i className="arrow-icon">→</i>
                </Link>
              </div>
            </div>
          </div>
          <div className="floating-elements">
            <div className="floating-circle circle-1"></div>
            <div className="floating-circle circle-2"></div>
            <div className="floating-circle circle-3"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Category Section */}
      <section className="category-section container-lg">
        <div>
          <div className="section-header">
            <h2 className="section-title">THE PERFECT GEAR FOR EVERY WORKOUT</h2>
            <p className="section-subtitle">Discover our premium collection designed for peak performance</p>
          </div>
          <div className="row g-4">
            {categories.map((category, index) => (
              <div className="col-lg-4 col-md-6 col-sm-12" key={index}>
                <div className="category-card animate-on-scroll">
                  <div className="category-image-container">
                    <img src={category.img} alt={category.title} className="category-image" />
                    <div className="category-overlay">
                      <div className="category-content">
                        <h3 className="category-title">{category.title}</h3>
                        <Link to={'/mens'} className="category-btn">
                          <span>SHOP NOW</span>
                          <i className="arrow-icon">→</i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Recommendation Section */}
      <section className="recommendation-section p-5">
        <div>
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="recommendation-content">
                <h2 className="recommendation-title">WELCOME TO YOUR EDIT</h2>
                <p className="recommendation-subtitle">Check out these products we've selected just for you based on your fitness goals.</p>
                <button className="recommendation-btn">
                  <span>SEE YOUR RECOMMENDATIONS</span>
                  <i className="arrow-icon">→</i>
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="products-showcase">
                {products.map((product, index) => (
                  <div key={index} className="recom-product-card animate-on-scroll">
                    <div className="product-image-container" style={{ height: "100%" }}>
                      <img src={product.img} alt={product.alt} className="product-image" />
                      <div className="product-overlay">
                        <button className="quick-view-btn">Quick View</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Popular Products Section */}
      <section className="popular-section container-lg">
        <div>
          <div className="section-header text-center">
            <h2 className="section-title">POPULAR RIGHT NOW</h2>
            <p className="section-subtitle">Trending items that fitness enthusiasts love</p>
          </div>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="popular-swiper"
          >
            {Swipper.map((product, index) => (
              <SwiperSlide key={index}>
                <div className="popular-product-card animate-on-scroll">
                  <div className="popular-image-container">
                    <img src={product.image} alt={product.title} className="popular-image" />
                    <div className="popular-overlay">
                      <Link to="/womens" className="popular-link">
                        <span>View Product</span>
                      </Link>
                    </div>
                  </div>
                  <div className="popular-content">
                    <h3 className="popular-title">{product.title}</h3>
                    <p className="popular-description">{product.description}</p>
                    <div className="popular-price">$49.99</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section container-lg">
        <div>
          <div className="section-header text-center">
            <h2 className="section-title">WHAT OUR CUSTOMERS SAY</h2>
            <p className="section-subtitle">Real stories from real fitness enthusiasts</p>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="testimonial-card animate-on-scroll">
                <div className="testimonial-rating">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <p className="testimonial-text">
                  "RepCore's gym wear is absolutely amazing! The quality is top-notch and the fit is perfect. I've never felt more confident during my workouts."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face" alt="Sarah" />
                  </div>
                  <div className="author-info">
                    <h5>Sarah Johnson</h5>
                    <span>Fitness Enthusiast</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="testimonial-card animate-on-scroll">
                <div className="testimonial-rating">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <p className="testimonial-text">
                  "The durability of RepCore products is unmatched. I've been using their gear for over a year and it still looks brand new!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" alt="Mike" />
                  </div>
                  <div className="author-info">
                    <h5>Mike Chen</h5>
                    <span>Personal Trainer</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="testimonial-card animate-on-scroll">
                <div className="testimonial-rating">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
                <p className="testimonial-text">
                  "Fast shipping, excellent customer service, and premium quality products. RepCore has become my go-to brand for all fitness gear."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face" alt="Emma" />
                  </div>
                  <div className="author-info">
                    <h5>Emma Davis</h5>
                    <span>Yoga Instructor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Shop Categories Section */}
      <section className="shop-categories-section container-lg">
        <div >
          <div className="section-header text-center">
            <h2 className="section-title">SHOP BY CATEGORY</h2>
            <p className="section-subtitle">Find the perfect gear for your fitness journey</p>
          </div>
          <div className="row">
            {shopCategories.map((category, index) => (
              <div key={index} className="col-lg-4 col-md-6 mb-4">
                <div className="shop-category-card animate-on-scroll">
                  <Link to={
                    category.label === "SHOP WOMEN" ? '/womens' :
                      category.label === "SHOP MEN" ? '/mens' : '/accessories'
                  }>
                    <div className="shop-image-container">
                      <img src={category.img} alt={category.alt} className="shop-image" />
                      <div className="shop-overlay">
                        <div className="shop-content">
                          <h3 className="shop-title">{category.label}</h3>
                          <span className="shop-arrow">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div >
          <div className="newsletter-container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="newsletter-content">
                  <h2 className="newsletter-title">STAY IN THE LOOP</h2>
                  <p className="newsletter-subtitle">
                    Get exclusive access to new arrivals, special offers, and fitness tips delivered straight to your inbox.
                  </p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="newsletter-form">
                  <div className="input-group">
                    <input
                      type="email"
                      className="newsletter-input"
                      placeholder="Enter your email address"
                    />
                    <button className="newsletter-btn">
                      <span>SUBSCRIBE</span>
                      <i className="arrow-icon">→</i>
                    </button>
                  </div>
                  <p className="newsletter-disclaimer">
                    By subscribing, you agree to our Privacy Policy and consent to receive updates from RepCore.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home