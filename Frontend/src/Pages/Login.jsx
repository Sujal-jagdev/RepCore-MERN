import axios from 'axios';
import React, { useState } from 'react';
import { SiTicktick } from "react-icons/si";
import { GoAlertFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setcontact] = useState('');
  const [userImage, setuserImage] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const navigate = useNavigate()
  const [popuUp, setpopuUp] = useState(null)

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    // Handle the sign-up logic here
    try {
      let response = await axios.post('http://localhost:3000/user/signup', { fullname, email, password,contact,userpicture: userImage }, { withCredentials: true });
      setpopuUp(true)
      navigate(`/profile`)
    } catch (error) {
      console.log(error)
      setpopuUp(false)
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // Handle the login logic here
    try {
      let res = await axios.post('http://localhost:3000/user/login', { email: loginEmail, password: loginPassword }, { withCredentials: true });
      setpopuUp(true)
      navigate(`/profile`)
    } catch (error) {
      console.log(error)
      setpopuUp(false)
    }
  };

  return (
    <div className="container my-5">
      {
        popuUp ? <div className="alert alert-success d-flex align-items-center" role="alert">
          <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><SiTicktick className='fs-5' /></svg>
          <div>
            Welcome To RepCore...
          </div>
        </div> : popuUp == null ? '' : <div class="alert alert-danger d-flex align-items-center" role="alert">
          <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><GoAlertFill className='fs-5' /></svg>
          <div>
            Email Or Password Are Worng!!
          </div>
        </div>
      }
      <div className="row justify-content-between align-items-center">
        {/* Sign Up Form */}
        <div className="col-lg-5 col-md-6 col-sm-8 m-auto col-12 mb-4">
          <h3 className="form-title">Welcome to <span className="brand-name">RepCore</span></h3>
          <p className="form-subtitle">Create your account</p>
          <form onSubmit={handleSignUpSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Contact +91"
                value={contact}
                onChange={(e) => setcontact(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Your Image Url"
                value={userImage}
                onChange={(e) => setuserImage(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Create My Account</button>
          </form>
        </div>

        {/* Login Form */}
        <div className="col-lg-5 col-md-6 col-sm-8 m-sm-auto col-12 mb-4">
          <h3 className="form-title">Login Your Account</h3>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>

      </div>
    </div >
  );
};

export default AuthForm;
