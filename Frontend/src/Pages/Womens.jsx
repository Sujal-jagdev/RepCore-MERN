import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import '../index.css';

// import required modules
import { Pagination } from 'swiper/modules';

const Womens = () => {
  const [showData, setshowData] = useState([]);
  const [productsWithImages, setProductsWithImages] = useState([]);

  const getData = async () => {
    let res = await axios.get("http://localhost:3000/product/womensproducts");
    setshowData(res.data.products);
  };

  console.log(showData)
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const convertImages = async () => {
      const updatedProducts = await Promise.all(
        showData.map((e) => {
          const bufferData = e.image.data;
          const blob = new Blob([new Uint8Array(bufferData)], { type: "image/jpeg" });

          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({ ...e, base64Image: reader.result });
            };
            reader.readAsDataURL(blob);
          });
        })
      );

      setProductsWithImages(updatedProducts);
    };

    if (showData.length > 0) {
      convertImages();
    }
  }, [showData]);

  return (
    <div>
      <div className='col-12 p-5 text-center text-light' style={{ backgroundColor: '#111' }}>
        <h2 className='fw-bolder'>GET AN EXTRA 20% OFF SALE ITEMS</h2>
        <h6 className='fw-normal'>Drop code EXTRA20 and thank us with a new PR.</h6>
        <button className='btn bg-light text-dark rounded-pill ps-4 pe-4 fw-bolder'>SHOP WOMEN</button>
      </div>

      <div className='col-12'>
        <video
          src="https://videos.ctfassets.net/wl6q2in9o7k3/16mZlbejxhQbzGHzGB8iFu/202e8ff4eff610ed5883a4bd5beb9a3d/Female_Look_Montage_V1_BANNER_3840x1440.mp4"
          className='col-12'
          autoPlay
          loop
          muted
        ></video>
      </div>

      <div className='container-fluid'>
        <h2 className='col-12 p-3 fw-bold mt-4'>SHOP WOMEN'S SALE</h2>
        <div className='position-relative h-100'>
          <Swiper
            spaceBetween={5}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              // Responsive design for different screen sizes
              320: { slidesPerView: 1 }, // Mobile
              768: { slidesPerView: 2 }, // Tablet
              1024: { slidesPerView: 3 }, // Desktop
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {productsWithImages.map((e, index) => (
              e.category == "women scroll" ? <SwiperSlide key={index} className="d-flex flex-column align-items-center position-relative">
                <img
                  src={e.base64Image}
                  alt={e.name}
                  style={{ width: "100%", height: "450px", objectFit: "cover" }}
                />
                <div className=' position-absolute text-light mt-5'>
                  <h5 className=" fw-bold fs-2">{e.name}</h5>
                  <button className=' btn bg-light text-dark rounded-2 ps-5 pe-5 fw-bold'>Shop Now</button>
                </div>
              </SwiperSlide> : ''
            ))}

          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Womens;
