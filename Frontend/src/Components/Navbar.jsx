import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaRegUser, FaUser } from "react-icons/fa6";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Logo from '../assets/Logo.png';
import { GetCartProduct } from '../Redux/AddToCartSlice';
import '../Style/Navbar.css'

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    
    // Get cart data from Redux store
    const { cartData } = useSelector((state) => state.AddToCart);
    const cartItemCount = cartData ? cartData.length : 0;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch cart data on component mount
    useEffect(() => {
        dispatch(GetCartProduct());
    }, [dispatch]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <nav className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="navbar-container">
                    {/* Logo */}
                    <Link className="navbar-brand" to="/" onClick={closeMobileMenu}>
                        <img src={Logo} alt="RepCore" className="navbar-logo" />
                        <span className="brand-text">REPCORE</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="desktop-nav">
                        <ul className="nav-links">
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${isActive('/womens') ? 'active' : ''}`}
                                    to="/womens"
                                >
                                    WOMEN'S
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${isActive('/mens') ? 'active' : ''}`}
                                    to="/mens"
                                >
                                    MEN'S
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${isActive('/accessories') ? 'active' : ''}`}
                                    to="/accessories"
                                >
                                    ACCESSORIES
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right Icons */}
                    <div className="navbar-icons">
                        <Link className="icon-link" to="/profile" title="Profile">
                            <FaRegUser className="nav-icon" />
                        </Link>
                        <Link className="icon-link cart-link" to="/cartpage" title="Cart">
                            <IoBagHandleOutline className="nav-icon" />
                            {cartItemCount > 0 && (
                                <span className="cart-badge">{cartItemCount}</span>
                            )}
                        </Link>
                        
                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-menu-toggle"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-menu-content">
                        <ul className="mobile-nav-links">
                            <li className="mobile-nav-item">
                                <Link
                                    className={`mobile-nav-link ${isActive('/womens') ? 'active' : ''}`}
                                    to="/womens"
                                    onClick={closeMobileMenu}
                                >
                                    WOMEN'S
                                </Link>
                            </li>
                            <li className="mobile-nav-item">
                                <Link
                                    className={`mobile-nav-link ${isActive('/mens') ? 'active' : ''}`}
                                    to="/mens"
                                    onClick={closeMobileMenu}
                                >
                                    MEN'S
                                </Link>
                            </li>
                            <li className="mobile-nav-item">
                                <Link
                                    className={`mobile-nav-link ${isActive('/accessories') ? 'active' : ''}`}
                                    to="/accessories"
                                    onClick={closeMobileMenu}
                                >
                                    ACCESSORIES
                                </Link>
                            </li>
                        </ul>
                        
                        <div className="mobile-user-actions">
                            <Link className="mobile-action-link" to="/profile" onClick={closeMobileMenu}>
                                <FaUser className="mobile-action-icon" />
                                <span>My Profile</span>
                            </Link>
                            <Link className="mobile-action-link" to="/cartpage" onClick={closeMobileMenu}>
                                <IoBagHandleOutline className="mobile-action-icon" />
                                <span>Shopping Cart</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
