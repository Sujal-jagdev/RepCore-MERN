import axios from 'axios';
import React, { useState } from 'react'
import { SiTicktick } from "react-icons/si";
import { GoAlertFill } from "react-icons/go";
import { FaLock, FaEnvelope, FaUserShield, FaUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../Contexts/AllContext'

const AdminCreate = () => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [popuUp, setpopuUp] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleOwnerCreateSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            let res = await axios.post(`${API}/owner/create`, { fullname, email, password }, {withCredentials: true});
            setpopuUp(true);
            setTimeout(() => {
                navigate("/adminpanel");
            }, 1500);
        } catch (error) {
            setpopuUp(false);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Admin account already exists or creation failed.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-5 col-md-7 col-sm-9">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-header bg-primary text-white text-center py-4">
                            <FaUserShield className="mb-2" size={40} />
                            <h3 className="font-weight-bold mb-0">Create Admin Account</h3>
                        </div>
                        
                        <div className="card-body p-4 p-md-5">
                            {popuUp === true && (
                                <div className="alert alert-success d-flex align-items-center" role="alert">
                                    <SiTicktick className='fs-5 me-2' />
                                    <div>Admin account created successfully! Redirecting to admin panel...</div>
                                </div>
                            )}
                            
                            {popuUp === false && (
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <GoAlertFill className='fs-5 me-2' />
                                    <div>{errorMessage || 'Admin already exists!'}</div>
                                </div>
                            )}
                            
                            <form onSubmit={handleOwnerCreateSubmit}>
                                <div className="mb-4">
                                    <label className="form-label">Full Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <FaUser />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            placeholder="Enter your full name"
                                            value={fullname}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <FaEnvelope />
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control py-2"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="form-label">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <FaLock />
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control py-2"
                                            placeholder="Create a strong password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary py-2 fw-bold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating account...
                                            </>
                                        ) : 'Create Admin Account'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        <div className="card-footer text-center py-3 bg-light">
                            <div className="small">
                                <Link to="/adminlogin" className="text-decoration-none">Already have an admin account? Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminCreate