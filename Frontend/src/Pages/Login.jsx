import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { SiTicktick } from "react-icons/si";
import { GoAlertFill } from "react-icons/go";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaImage, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { API, useAuth } from '../Contexts/AllContext';
import '../Style/Login.css';

const AuthForm = () => {
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setcontact] = useState('');
  const [userpicture, setuserpicture] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [signupStatus, setSignupStatus] = useState(null); // null, 'success', 'error'
  const [loginStatus, setLoginStatus] = useState(null); // null, 'success', 'error'
  const { isAuthenticated } = useAuth();
  
  // Get redirect path from location state or default to profile
  const from = location.state?.from || '/user/profile';
  const message = location.state?.message || null;
  
  // Redirect if already logged in
  useEffect(() => {
    console.log('Authentication state changed:', isAuthenticated);
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to:', from);
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);
  
  // Show message from redirect if exists
  useEffect(() => {
    if (message) {
      setLoginStatus('error');
    }
  }, [message]);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    // Reset login status when attempting signup
    setLoginStatus(null);
    // Handle the sign-up logic here
    try {
      const formData = new FormData();
      formData.append('userpicture', userpicture);
      formData.append("fullname", fullname);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("contact", contact);

      const response = await axios.post(`${API}/user/signup`, formData, { withCredentials: true });
      setSignupStatus('success');
      // Redirect to email verification page with user ID
      navigate(`/verify-email`, { state: { email: email, userId: response.data.userId } });
    } catch (error) {
      console.log(error);
      setSignupStatus('error');
    } finally {
      setSignupLoading(false);
    }
  };

  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    // Reset signup status when attempting login
    setSignupStatus(null);
    try {
      // Use the login function from AuthContext instead of direct API call
      const result = await login(loginEmail, loginPassword);
      
      if (result.success) {
        setLoginStatus('success');
        // Short delay to show success message before redirecting
        setTimeout(() => {
          navigate(from);
        }, 1000);
      } else if (result.needsVerification) {
        // If email is not verified, redirect to verification page
        navigate('/verify-email', { state: { email: loginEmail, userId: result.userId } });
      } else {
        setLoginStatus('error');
      }
    } catch (error) {
      console.log(error);
      setLoginStatus('error');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="login-card">
          <div className="card-body p-3">
            {/* Signup Alerts */}
            {signupStatus === 'success' && (
              <div className="alert alert-success d-flex align-items-center animate-in" role="alert">
                <SiTicktick className='fs-5 me-2' />
                <div>
                  Account created successfully! Welcome to RepCore.
                </div>
              </div>
            )}
            {signupStatus === 'error' && (
              <div className="alert alert-danger d-flex align-items-center animate-in" role="alert">
                <GoAlertFill className='fs-5 me-2' />
                <div>
                  Failed to create account. Please try again.
                </div>
              </div>
            )}
            
            {/* Login Alerts */}
            {loginStatus === 'success' && (
              <div className="alert alert-success d-flex align-items-center animate-in" role="alert">
                <SiTicktick className='fs-5 me-2' />
                <div>
                  Welcome back to RepCore!
                </div>
              </div>
            )}
            {loginStatus === 'error' && (
              <div className="alert alert-danger d-flex align-items-center animate-in" role="alert">
                <GoAlertFill className='fs-5 me-2' />
                <div>
                  Email or password is incorrect. Please try again.
                </div>
              </div>
            )}
            <div className="row justify-content-center align-items-center gap-3">
        {/* Sign Up Form */}
        <div className="col-lg-4 col-md-5 col-sm-10 col-12 mb-3 animate-in" style={{animationDelay: '0.1s'}}>
          <div className="form-card">
            <div className="card-body p-0">
              <h3 className="form-title text-center mb-1">Welcome to <span className="brand-name">RepCore</span></h3>
              <p className="form-subtitle text-center text-muted mb-3">Create your account</p>

              <form onSubmit={handleSignUpSubmit} encType="multipart/form-data">

                <div className="input-group">
                  <label className="form-label text-muted">Full Name</label>
                  <div className="position-relative">
                    <FaUser className="input-group-icon" />
                    <input
                      type="text"
                      className="form-control form-control-lg form-control-icon"
                      placeholder="Enter your full name"
                      value={fullname}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="form-label text-muted">Email Address</label>
                  <div className="position-relative">
                    <FaEnvelope className="input-group-icon" />
                    <input
                      type="email"
                      className="form-control form-control-lg form-control-icon"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="form-label text-muted">Password</label>
                  <div className="position-relative">
                    <FaLock className="input-group-icon" />
                    <input
                      type="password"
                      className="form-control form-control-lg form-control-icon"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="form-label text-muted">Contact Number</label>
                  <div className="position-relative">
                    <FaPhone className="input-group-icon" />
                    <input
                      type="number"
                      className="form-control form-control-lg form-control-icon"
                      placeholder="+91 Contact Number"
                      value={contact}
                      onChange={(e) => setcontact(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group mb-3">
                  <label className="form-label text-muted">Profile Picture</label>
                  <div className="position-relative">
                    <FaImage className="input-group-icon" />
                    <input
                      type="file"
                      className="form-control form-control-lg form-control-icon"
                      name='userpicture'
                      onChange={(e) => setuserpicture(e.target.files[0])}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn text-light btn-gradient w-100 mb-2 d-flex align-items-center justify-content-center"
                  disabled={signupLoading || loginLoading}
                >
                  {signupLoading ? (
                    'Creating Account...'
                  ) : (
                    <>
                      <FaUserPlus className="me-1 " size={14} /> Create Account
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="col-lg-4 col-md-5 col-sm-10 col-12 mb-3 animate-in" style={{animationDelay: '0.3s'}}>
          <div className="form-card">
            <div className="card-body p-0">
              <h3 className="form-title text-center mb-1">Login to Your Account</h3>
              <p className="form-subtitle text-center text-muted mb-3">Welcome back to RepCore</p>
              
              <form onSubmit={handleLoginSubmit}>
                <div className="input-group">
                  <label className="form-label text-muted">Email Address</label>
                  <div className="position-relative">
                    <FaEnvelope className="input-group-icon" />
                    <input
                      type="email"
                      className="form-control form-control-lg form-control-icon"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="input-group mb-4">
                  <label className="form-label text-muted">Password</label>
                  <div className="position-relative">
                    <FaLock className="input-group-icon" />
                    <input
                      type="password"
                      className="form-control form-control-lg form-control-icon"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn text-light btn-gradient w-100 mb-2 d-flex align-items-center justify-content-center"
                  disabled={loginLoading || signupLoading}
                >
                  {loginLoading ? (
                    'Logging in...'
                  ) : (
                    <>
                      <FaSignInAlt className="me-1" size={14} /> Login
                    </>
                  )}
                </button>
                
                <div className="text-center mt-2">
                  <a href="#" className="text-decoration-none small text-muted">Forgot your password?</a>
                </div>
              </form>
            </div>
          </div>
        </div>

          </div>
          
          {/* Divider for mobile view */}
          <div className="d-block d-md-none my-4">
            <div className="divider">
              <span>OR</span>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Minimal decoration */}
      <div className="position-absolute top-0 end-0 mt-5 me-5 d-none d-lg-block">
        <div className="rounded-circle" style={{width: '100px', height: '100px', border: '1px solid #e9ecef'}}></div>
      </div>
      <div className="position-absolute bottom-0 start-0 mb-5 ms-5 d-none d-lg-block">
        <div className="rounded-circle" style={{width: '150px', height: '150px', border: '1px solid #e9ecef'}}></div>
      </div>
    </div>
    </div>
  );
};

export default AuthForm;
