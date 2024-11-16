import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate()
  const [userData, setuserData] = useState({})
  const isAuth = async () => {
    try {
      let res = await axios.get(`http://localhost:3000/user/profile`, { withCredentials: true })
      setuserData(res.data.user)
      console.log(res)
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

  const { fullname, email, cart, orders } = userData;
  return (
    <>
      <h2 className=' text-center m-3'>Your RepCore Account</h2>
      <div className=' container-lg p-5 d-flex justify-content-between col-12'>

        <div className=' d-flex col-5 bg-light border p-2 border-dark'>
          <div className='col-3 m-2' style={{ height: '100px', borderRadius: '50%', objectFit: 'cover', overflow: 'hidden' }}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLe5PABjXc17cjIMOibECLM7ppDwMmiDg6Dw&s" alt="" className='col-12' style={{ height: '100%', objectFit: 'cover' }} />
          </div>

          <div className=' ms-2 col-9'>
            <h3>Hello, {fullname} 👋</h3>
            <h6>You ID: {email}</h6>
            <h6 style={{ cursor: 'pointer' }} onClick={HandleLogout}>Logout</h6>
          </div>
        </div>

        <div className=' col-7 p-4'>
          <h3>Your Orders</h3>
        </div>
      </div>
    </>
  )
}

export default Profile