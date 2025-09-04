import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light py-5">
      <div className="container-fluid">
        {/* Section 1: Categories */}
        <div className="row">
          <div className="col-md-3">
            <h5 className="fw-bold">WOMEN'S LEGGINGS</h5>
            <ul className="list-unstyled">
              <li>Gym Leggings</li>
              <li>Leggings With Pockets</li>
              <li>High Waisted Leggings</li>
              <li>Scrunch Bum Leggings</li>
              <li>Black Leggings</li>
              <li>Flared Leggings</li>
              <li>Seamless Leggings</li>
              <li>Petite Gym Leggings</li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5 className="fw-bold">WOMEN'S GYMWEAR</h5>
            <ul className="list-unstyled">
              <li>Women's Gym Wear</li>
              <li>Womens Gym Shorts</li>
              <li>Running Shorts</li>
              <li>Sports Bras</li>
              <li>High Impact Sports Bras</li>
              <li>Black Sports Bras</li>
              <li>Matching Sets</li>
              <li>Loungewear</li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5 className="fw-bold">MEN'S GYMWEAR</h5>
            <ul className="list-unstyled">
              <li>Men's Gymwear</li>
              <li>Mens Gym Shorts</li>
              <li>Shorts with Pockets</li>
              <li>Men's Running Shorts</li>
              <li>Gym T-Shirts & Tops</li>
              <li>Sleeveless T-Shirts</li>
              <li>Gym Stringers</li>
              <li>Men's Baselayers</li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5 className="fw-bold">ACCESSORIES</h5>
            <ul className="list-unstyled">
              <li>Women's Underwear</li>
              <li>Men's Underwear</li>
              <li>Workout Bags</li>
              <li>Duffel Bags</li>
              <li>Gym Socks</li>
              <li>Crew Socks</li>
              <li>Caps</li>
              <li>Beanies</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
