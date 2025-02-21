import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa6";
import { IoBagHandleOutline } from "react-icons/io5";
import Logo from '../assets/Logo.png';
import '../Style/Navbar.css'

const Navbar = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light p-0" >
                <div className=" container-fluid">
                    {/* Left-aligned logo */}
                    <Link className="navbar-brand" to="/">
                        <img src={Logo} alt="Logo" className="navbar-logo" />
                    </Link>

                    <div className="d-flex align-items-center justify-content-center m-auto d-lg-none d-md-flex d-sm-flex d-none">
                        <Link className="nav-link" to="/profile">
                            <FaRegUser style={{ fontSize: '18px' }} />
                        </Link>
                        <Link className="nav-link" to="/cart">
                            <IoBagHandleOutline style={{ fontSize: '18px' }} />
                        </Link>
                    </div>

                    {/* Navbar toggle button for smaller screens, moved to the right */}
                    <button className="navbar-toggler ms-auto " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Center-aligned Links */}
                    <div className="collapse navbar-collapse justify-content-center ps-lg-5 position-sticky" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/womens">WOMEN'S</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/mens">MEN'S</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/accessories">ACCESSORIES</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right-aligned Icons (centered on larger screens, moved below on mobile) */}
                    <div className="d-lg-flex align-items-center justify-content-center d-sm-none d-sm-none d-md-none  d-flex col-12 col-lg-3 gap-lg-2 gap-4">
                        <Link className="nav-link" to="/profile">
                            <FaRegUser style={{ fontSize: '18px' }} />
                        </Link>
                        <Link className="nav-link" to="/cartpage">
                            <IoBagHandleOutline style={{ fontSize: '20px' }} />
                        </Link>
                    </div>
                </div>
            </nav>


        </>
    );
};

export default Navbar;
