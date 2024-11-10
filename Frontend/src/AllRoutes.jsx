// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from './Components/Navbar'; // Ensure correct path to Navbar component
import Home from './Pages/Home';
import Products from './Pages/Products';
import Womens from './Pages/Womens';
import Mens from './Pages/Mens';
import Login from './Pages/Login';
import AdminCreate from './Pages/AdminCreate';
import AdminLogin from './Pages/AdminLogin';

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Define routes here */}
                <Route path="/" element={<Home />} />
                <Route path="/womens" element={<Womens />} />
                <Route path="/mens" element={<Mens />} />
                <Route path="/accessories" element={<Products />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/owner/create" element={<AdminCreate />} />
                <Route path="/admin/owner/login" element={<AdminLogin />} />
                <Route path="*" element={<h1>Page Not Found</h1>} />
            </Routes>
        </>
    );
}

export default App;
