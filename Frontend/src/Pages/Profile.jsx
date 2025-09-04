import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API } from '../Contexts/AllContext';
import { motion } from 'framer-motion';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [base64Image, setBase64Image] = useState(null);

  // Authentication check
  const isAuth = async () => {
    try {
      const res = await axios.get(`${API}/user/profile`, { withCredentials: true });
      setUserData(res.data.user);

      const bufferData = res.data.user.userpicture.data;
      const blob = new Blob([new Uint8Array(bufferData)], { type: 'image/jpeg' });
      const reader = new FileReader();

      reader.onloadend = () => {
        setBase64Image(reader.result.split(',')[1]);
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.log(error);
      navigate('/login');
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.get(`${API}/user/logout`, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

  const { fullname, email, contact } = userData;

  return (
    <div className="container mt-5 pt-5" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)', minHeight: '80vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-0 mx-auto overflow-hidden" 
        style={{ maxWidth: '900px', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
      >
        {/* Header Banner */}
        <div className="position-relative" style={{ 
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', 
          height: '180px', 
          overflow: 'hidden'
        }}>
          <div className="position-absolute w-100 h-100" style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1675&q=80")', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2
          }}></div>
          <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white">
            <h2 className="display-6 fw-bold mb-0">Welcome Back!</h2>
            <p className="mb-0 opacity-75">Your <span className="fw-bold">RepCore</span> fitness journey</p>
          </div>
        </div>
        
        <div className="bg-white p-0">
          <div className="row g-0">
            {/* Profile Picture Section */}
            <div className="col-lg-4 position-relative">
              <div className="h-100 p-4 p-lg-5" style={{ background: 'linear-gradient(to bottom, #f9fafc, #f0f4f8)' }}>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-center position-relative"
                  style={{ marginTop: '-80px' }}
                >
                  <div className="rounded-circle overflow-hidden mx-auto position-relative" 
                    style={{ 
                      width: '160px', 
                      height: '160px', 
                      backgroundColor: '#fff',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 0 0 8px rgba(255,255,255,0.9)',
                      zIndex: 10
                    }}>
                    {base64Image ? (
                      <img
                        src={`data:image/jpeg;base64,${base64Image}`}
                        alt="Profile"
                        className="img-fluid"
                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100 text-primary">
                        <i className="bi bi-person-circle" style={{ fontSize: '5rem' }}></i>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="fw-bold mb-1">{fullname || 'User'}</h3>
                    <div className="d-inline-block px-3 py-1 rounded-pill" style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', color: 'white' }}>
                      <span className="small"><i className="bi bi-star-fill me-1"></i>Premium Member</span>
                    </div>
                  </div>
                </motion.div>
                
                <div className="mt-5 pt-3">
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" 
                      style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', color: 'white' }}>
                      <i className="bi bi-trophy"></i>
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0 fw-bold">Fitness Level</h6>
                      <p className="mb-0 small text-muted">Advanced</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" 
                      style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', color: 'white' }}>
                      <i className="bi bi-calendar-check"></i>
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0 fw-bold">Member Since</h6>
                      <p className="mb-0 small text-muted">January 2023</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" 
                      style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', color: 'white' }}>
                      <i className="bi bi-bag-check"></i>
                    </div>
                    <div className="ms-3">
                      <h6 className="mb-0 fw-bold">Total Orders</h6>
                      <p className="mb-0 small text-muted">12 orders</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info Section */}
            <div className="col-lg-8">
              <div className="p-4 p-lg-5">
                <h4 className="fw-bold mb-4" style={{ color: '#2575fc' }}>
                  <i className="bi bi-person-badge me-2"></i>Personal Information
                </h4>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-4 rounded-4" style={{ 
                      background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                      boxShadow: '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff'
                    }}>
                      <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" 
                          style={{ width: '36px', height: '36px', background: 'rgba(37, 117, 252, 0.1)', color: '#2575fc' }}>
                          <i className="bi bi-person"></i>
                        </div>
                        <p className="ms-3 mb-0 text-muted small">Full Name</p>
                      </div>
                      <h5 className="mb-0 fw-bold">{fullname}</h5>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="p-4 rounded-4" style={{ 
                      background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                      boxShadow: '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff'
                    }}>
                      <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" 
                          style={{ width: '36px', height: '36px', background: 'rgba(37, 117, 252, 0.1)', color: '#2575fc' }}>
                          <i className="bi bi-envelope"></i>
                        </div>
                        <p className="ms-3 mb-0 text-muted small">Email Address</p>
                      </div>
                      <h5 className="mb-0 fw-bold">{email}</h5>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="p-4 rounded-4" style={{ 
                      background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                      boxShadow: '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff'
                    }}>
                      <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" 
                          style={{ width: '36px', height: '36px', background: 'rgba(37, 117, 252, 0.1)', color: '#2575fc' }}>
                          <i className="bi bi-telephone"></i>
                        </div>
                        <p className="ms-3 mb-0 text-muted small">Contact Number</p>
                      </div>
                      <h5 className="mb-0 fw-bold">+91 {contact}</h5>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="p-4 rounded-4" style={{ 
                      background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                      boxShadow: '5px 5px 10px #e6e6e6, -5px -5px 10px #ffffff'
                    }}>
                      <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" 
                          style={{ width: '36px', height: '36px', background: 'rgba(37, 117, 252, 0.1)', color: '#2575fc' }}>
                          <i className="bi bi-geo-alt"></i>
                        </div>
                        <p className="ms-3 mb-0 text-muted small">Location</p>
                      </div>
                      <h5 className="mb-0 fw-bold">Mumbai, India</h5>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5">
                  <h4 className="fw-bold mb-4" style={{ color: '#2575fc' }}>
                    <i className="bi bi-gear me-2"></i>Account Actions
                  </h4>
                  
                  <div className="d-flex flex-wrap gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(37, 117, 252, 0.2)' }}
                      whileTap={{ scale: 0.98 }}
                      className="btn px-4 py-3 rounded-pill" 
                      style={{ 
                        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 5px 15px rgba(37, 117, 252, 0.3)'
                      }}
                      onClick={() => navigate('/orders')}
                    >
                      <i className="bi bi-bag-check-fill me-2"></i>My Orders
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(220, 53, 69, 0.2)' }}
                      whileTap={{ scale: 0.98 }}
                      className="btn px-4 py-3 rounded-pill" 
                      style={{ 
                        background: 'white',
                        color: '#dc3545',
                        border: '2px solid #dc3545',
                        boxShadow: '0 5px 15px rgba(220, 53, 69, 0.1)'
                      }}
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(13, 110, 253, 0.2)' }}
                      whileTap={{ scale: 0.98 }}
                      className="btn px-4 py-3 rounded-pill" 
                      style={{ 
                        background: 'white',
                        color: '#0d6efd',
                        border: '2px solid #0d6efd',
                        boxShadow: '0 5px 15px rgba(13, 110, 253, 0.1)'
                      }}
                      onClick={() => navigate('/')}
                    >
                      <i className="bi bi-house-door me-2"></i>Home
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
