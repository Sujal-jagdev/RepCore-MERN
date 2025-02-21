import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API } from '../Contexts/AllContext';

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
    <div className={`container mt-5 pt-5`}>
      <h2 className="text-center mb-4">Your RepCore Account</h2>
      <div className="row justify-content-center align-items-center">
        {/* Profile Picture Section */}
        <div className="col-md-4 text-center mb-4">
          <div
            className="rounded-circle overflow-hidden border"
            style={{ width: '150px', height: '150px' }}
          >
            <img
              src={`data:image/jpeg;base64,${base64Image}`}
              alt="Profile"
              className="img-fluid"
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* User Info Section */}
        <div className="col-md-6">
          <h3 className="mb-3">Hello, {fullname} 👋</h3>
          <p className="mb-1"><strong>Email:</strong> {email}</p>
          <p className="mb-1"><strong>Contact:</strong> +91 {contact}</p>
          <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>

  );
};

export default Profile;
