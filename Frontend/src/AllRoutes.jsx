// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar'; // Ensure correct path to Navbar component
import Home from './Pages/Home';
import Womens from './Pages/Womens';
import Mens from './Pages/Mens';
import Login from './Pages/Login';
import AdminCreate from './Pages/AdminCreate';
import AdminLogin from './Pages/AdminLogin';
import Profile from './Pages/Profile';
import AdminPanel from './Pages/AdminPanel';
import Description from './Pages/Description';
import CartPage from './Pages/CartPage';
import Accessories from './Pages/Accessories';
import Cookies from 'js-cookie';
import Footer from './Components/Footer';

function App() {
    const location = useLocation();
    const navigate = useNavigate()
    const token = Cookies.get('adminToken')
    return (
        <>
            {location.pathname !== '/adminpanel' && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/womens" element={<Womens />} />
                <Route path="/mens" element={<Mens />} />
                <Route path="/description/:id" element={<Description />} />
                <Route path="/accessories" element={<Accessories />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/owner/create" element={<AdminCreate />} />
                <Route path="/admin/owner/login" element={<AdminLogin />} />
                <Route path="/adminpanel" element={
                    token ? <AdminPanel /> : <Navigate to={"/"} />
                } />
                <Route path="/cartpage" element={<CartPage />} />
                <Route path="*" element={<h1>Page Not Found</h1>} />
            </Routes>
            <div className="mt-5">
                {location.pathname !== '/adminpanel' && location.pathname !== '/profile' && <Footer />}
            </div>

        </>
    );
}

export default App;
