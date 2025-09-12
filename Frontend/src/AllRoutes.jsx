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
import Checkout from './Pages/Checkout';
import OrderHistory from './Pages/OrderHistory';
import UserProfile from './Pages/UserProfile';
import Wishlist from './Pages/Wishlist';
import ProductDetail from './Pages/ProductDetail';
import VerifyEmail from './Pages/VerifyEmail';
import Cookies from 'js-cookie';
import Footer from './Components/Footer';
import { useAuth } from './Contexts/AllContext';
import ForgotPass from './Pages/ForgotPass';
import ResetPass from './Pages/ResetPass';

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

// Route that can be accessed without login but shows enhanced features when logged in
const OptionalAuthRoute = ({ children }) => {
    return children;
};

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
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/accessories" element={<Accessories />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgotpassword" element={<ForgotPass />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/reset-password/:token" element={<ResetPass />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                       <UserProfile />      
                    </ProtectedRoute>
                } />
                <Route path="/user/profile" element={
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        <OrderHistory />
                    </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                    <ProtectedRoute>
                        <Wishlist />
                    </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                    <OptionalAuthRoute>
                        <Checkout />
                    </OptionalAuthRoute>
                } />
                <Route path="/admin/owner/create" element={<AdminCreate />} />
                <Route path="/admin/owner/login" element={<AdminLogin />} />
                <Route path="/adminpanel" element={
                    token ? <AdminPanel /> : <Navigate to={"/"} />
                } />
                
                <Route path="/cartpage" element={
                    <OptionalAuthRoute>
                        <CartPage />
                    </OptionalAuthRoute>
                } />
                <Route path="*" element={<h1>Page Not Found</h1>} />
            </Routes>
            <div className="mt-5">
                {location.pathname !== '/adminpanel' &&
                 location.pathname !== '/profile' &&
                 location.pathname !== '/user/profile' &&
                 location.pathname !== '/checkout' &&
                 location.pathname !== '/cartpage' &&
                 location.pathname !== '/login' &&
                 location.pathname !== '/verify-email' &&
                 <Footer />}
            </div>

        </>
    );
}

export default App;
