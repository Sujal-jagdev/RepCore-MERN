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

        {/* Section 2: Info Text */}
        <div className="row mt-5">
          <div className="col-12">
            <h5 className="fw-bold">WORKOUT CLOTHES & GYM CLOTHES</h5>
            <p>
              Workout Clothes designed to help you become your personal best. Because when it comes to performing at your max, there should be no obstacles—least of all your workout clothes.
            </p>
            <h6 className="fw-bold">GYM CLOTHES BUILT IN THE WEIGHT ROOM</h6>
            <p>
              Our legacy was built in the weight room. Gymshark was founded with a love for training and that passion continues into all our gym clothes today. You’ll find the latest innovation in gym clothing and accessories to help you perform at your best and recover in style.
            </p>
            <h6 className="fw-bold">ACTIVEWEAR & ATHLEISURE</h6>
            <p>
              We create the tools that help everyone become their personal best—no matter the sport. Our range of Activewear is designed to give you the support you need to perform at your best, whether that’s on the track, on the gym floor or in the studio.
            </p>
            <h6 className="fw-bold">MORE THAN YOUR BEST WORKOUT CLOTHING</h6>
            <p>
              The Gymshark community is dedicated to unlocking potential through conditioning and the things we do today to prepare for tomorrow. It’s every setback, step-up and milestone along the way. Game-changing workout clothing, running clothes and loungewear essentials.
            </p>
          </div>
        </div>

        {/* Section 3: Footer Links */}
        <div className="row mt-5">
          <div className="col-md-3">
            <h6 className="fw-bold">HELP</h6>
            <ul className="list-unstyled">
              <li>FAQ</li>
              <li>Delivery Information</li>
              <li>Returns Policy</li>
              <li>Make A Return</li>
              <li>Orders</li>
              <li>Submit a Fake</li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold">MY ACCOUNT</h6>
            <ul className="list-unstyled">
              <li>Login</li>
              <li>Register</li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold">PAGES</h6>
            <ul className="list-unstyled">
              <li>Refer a Friend</li>
              <li>Gymshark Central</li>
              <li>About Us</li>
              <li>Careers</li>
              <li>Student Discount</li>
              <li>Military Discount</li>
              <li>Accessibility Statement</li>
              <li>Factory List</li>
              <li>Sustainability</li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold">MORE ABOUT GYMSHARK</h6>
            <ul className="list-unstyled">
              <li>Blog</li>
              <li>Email Sign Up</li>
              <li>Gymshark Training</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <p className="mb-0">&copy; 2025 | Gymshark Limited | All Rights Reserved.</p>
          <ul className="list-inline mb-0">
            <li className="list-inline-item">Terms & Conditions</li>
            <li className="list-inline-item">Terms of Use</li>
            <li className="list-inline-item">Privacy Notice</li>
            <li className="list-inline-item">Cookie Policy</li>
            <li className="list-inline-item">Modern Slavery</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
