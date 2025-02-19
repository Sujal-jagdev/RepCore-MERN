import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';

const Profile = () => {
  const navigate = useNavigate()
  const [userData, setuserData] = useState({})
  const [base64Image, setbase64Image] = useState(null)

  const isAuth = async () => {
    try {
      let res = await axios.get(`http://localhost:3000/user/profile`, { withCredentials: true })
      setuserData(res.data.user)

      let bufferData = res.data.user.userpicture.data;
      let blob = new Blob([new Uint8Array(bufferData)], { type: 'image/jpeg' }); // Adjust the type (image/jpeg) accordingly
      let reader = new FileReader();

      reader.onloadend = function () {
        setbase64Image(reader.result.split(',')[1])  // Get the Base64-encoded data (remove the metadata part)
        // This is the Base64 string for the image
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.log(error)
      navigate('/login')
    }
  }

  const HandleLogout = async () => {
    try {
      let res = await axios.get(`http://localhost:3000/user/logout`, { withCredentials: true })
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    isAuth()
  }, [])

  const { fullname, email, cart, orders, contact, userpicture } = userData;
  return (
    <>
      <h2 className=' text-center m-3 mt-5 pt-5'>Your RepCore Account</h2>
      <div className=' container-lg p-5 d-lg-flex justify-content-between col-12'>
        <div className=' d-lg-flex d-sm-flex d-md-flex col-lg-5 p-2 col-md-6 col-sm-9 col-12'>
          <div className='col-lg-3 col-sm-3 col-md-3 col-6 m-lg-2 m-sm-2 m-md-2 m-auto' style={{ height: '100px', borderRadius: '50%', objectFit: 'cover', overflow: 'hidden' }}>
            <img src={`data:image/jpeg;base64,${base64Image}`} alt="You Profie Image Has Been Some Issue" className='col-12' style={{ height: '100%', objectFit: 'cover' }} />
          </div>

          <div className=' ms-2 col-lg-9 col-sm-9 col-md-9 col-12'>
            <h3>Hello, {fullname} 👋</h3>
            <h6>You ID: {email}</h6>
            <h6>+91 {contact}</h6>
            <h6 style={{ cursor: 'pointer' }} className=' text-danger fw-bolder' onClick={HandleLogout}>Logout</h6>
          </div>
        </div>

        <div className='bg-dark ms-3 d-lg-block d-none' style={{ padding: '1px', height: '350px' }}> </div>

        <div className=' col-lg-7 col-12 p-4'>
          <h3>Your Orders: </h3>
        </div>

      </div>
    </>
  )
}

export default Profile