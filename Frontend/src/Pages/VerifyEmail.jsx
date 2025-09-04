import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../Contexts/AllContext';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import { SiTicktick } from 'react-icons/si';
import { GoAlertFill } from 'react-icons/go';

const VerifyEmail = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // null, 'success', 'error'
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(0);
    
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get email and userId from location state
    const email = location.state?.email;
    const userId = location.state?.userId;
    
    useEffect(() => {
        // If no email or userId is provided, redirect to login
        if (!email || !userId) {
            navigate('/login');
        }
    }, [email, userId, navigate]);
    
    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);
    
    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post(`${API}/user/verify-otp`, {
                email,
                otp
            });
            
            setStatus('success');
            setMessage(response.data.message || 'Email verified successfully!');
            
            // Redirect to login page after successful verification
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to verify email. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleResendOtp = async () => {
        if (countdown > 0) return;
        
        setLoading(true);
        try {
            const response = await axios.post(`${API}/user/resend-otp`, { email });
            setStatus('success');
            setMessage(response.data.message || 'New verification code sent to your email');
            setCountdown(60); // Set 60 seconds cooldown
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to resend verification code');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="login-container">
            <div className="container">
                <div className="login-card">
                    <div className="card-body p-3">
                        {/* Status Alerts */}
                        {status === 'success' && (
                            <div className="alert alert-success d-flex align-items-center animate-in" role="alert">
                                <SiTicktick className='fs-5 me-2' />
                                <div>{message}</div>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="alert alert-danger d-flex align-items-center animate-in" role="alert">
                                <GoAlertFill className='fs-5 me-2' />
                                <div>{message}</div>
                            </div>
                        )}
                        
                        <div className="row justify-content-center align-items-center">
                            <div className="col-lg-4 col-md-6 col-sm-10 col-12 mb-3 animate-in">
                                <div className="form-card">
                                    <div className="card-body p-0">
                                        <h3 className="form-title text-center mb-1">Verify Your Email</h3>
                                        <p className="form-subtitle text-center text-muted mb-3">
                                            We've sent a verification code to <strong>{email}</strong>
                                        </p>
                                        
                                        <form onSubmit={handleVerifySubmit}>
                                            <div className="input-group">
                                                <label className="form-label text-muted">Verification Code</label>
                                                <div className="position-relative">
                                                    <FaKey className="input-group-icon" />
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-lg form-control-icon"
                                                        placeholder="Enter 6-digit code"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        required
                                                        maxLength="6"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <button 
                                                type="submit" 
                                                className="btn text-light btn-gradient w-100 mb-2 d-flex align-items-center justify-content-center"
                                                disabled={loading}
                                            >
                                                {loading ? 'Verifying...' : 'Verify Email'}
                                            </button>
                                            
                                            <div className="text-center mt-3">
                                                <button 
                                                    type="button" 
                                                    className="btn btn-link text-decoration-none"
                                                    onClick={handleResendOtp}
                                                    disabled={countdown > 0 || loading}
                                                >
                                                    {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend verification code'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;