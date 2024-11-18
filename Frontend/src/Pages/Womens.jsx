import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaStar } from "react-icons/fa";

const Womens = () => {
  const [showData, setshowData] = useState([])
  const [productsWithImages, setProductsWithImages] = useState([]);

  const getData = async () => {
    let res = await axios.get("http://localhost:3000/product/womensproducts");
    setshowData(res.data.products)
  }
  useEffect(() => {
    getData()
  }, [])

  let randomRating = Math.floor(Math.random()*5)
  let randomRating2 = Math.floor(Math.random()*5)

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

    convertImages();
  }, [showData]);

  return (
    <>
      <div className=' col-12 p-5 text-center text-light' style={{ backgroundColor: '#111' }}>
        <h2 className=' fw-bolder'>GET AN EXTRA 20% OFF SALE ITEMS</h2>
        <h6 className=' fw-normal'>Drop code EXTRA20 and thank us with a new PR.</h6>
        <button className='btn bg-light text-dark rounded-pill ps-4 pe-4 fw-bolder'>SHOP WOMEN</button>
      </div>

      <div className=' col-12'>
        <video src="https://videos.ctfassets.net/wl6q2in9o7k3/16mZlbejxhQbzGHzGB8iFu/202e8ff4eff610ed5883a4bd5beb9a3d/Female_Look_Montage_V1_BANNER_3840x1440.mp4" className='col-12' autoPlay loop muted></video>
      </div>

      <div className=' p-3'>
        {
          productsWithImages.map((e) => (
            <>
              <div className=' col-3' style={{
                height: "300px",
                backgroundColor: e.bgColor,
                boxShadow: `0.5px 0.5px 3.6px ${e.bgColor}`,
                position: 'relative'
              }}>

                <div className="col-12">
                  <img
                    className="col-12"
                    style={{ height: "220px", objectFit: "cover" }}
                    src={e.base64Image}
                    alt={e.name}
                  />
                </div>

                <div className="col-12 p-3 d-flex" style={{ backgroundColor: e.panelColor, position: 'absolute', bottom: '0' }}>
                  <div className="col-10" style={{ color: e.textColor }}>
                    <h5 className="fw-lighter">{e.name}</h5>
                    <h6 style={{ marginTop: "-8px" }}>${e.price} <span className='text-danger text-decoration-line-through'>${e.discount}</span></h6>
                  </div>
                  <div className=' text-light'>
                    <p><FaStar className=' pb-1' /> {randomRating > 2 ? randomRating : '3.1'}.{randomRating > 2 ? randomRating : ''}</p>
                  </div>
                </div>

              </div>
            </>
          ))
        }
      </div>
    </>
  )
}

export default Womens