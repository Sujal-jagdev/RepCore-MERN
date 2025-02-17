import React from 'react'
import '../Style/Home.css'

const Home = () => {
  return (
    <div>
      <div className="banner-container">
        <h2 className="banner-text">
          Outfit Your Fitness Goals with Premium Gym Gear
        </h2>
        <div className="button-group">
          <button className="btn-custom">Shop Womens</button>
          <button className="btn-custom">Shop Mens</button>
        </div>
      </div>
    </div>
  )
}

export default Home