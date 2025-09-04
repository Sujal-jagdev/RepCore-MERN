import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, useAuth } from '../Contexts/AllContext';
import '../Style/UserProfile.css';

const UserProfile = () => {
    const { user, setUser, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        }
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        fetchUserProfile();
    }, [isAuthenticated, navigate]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API}/user/profile`, { withCredentials: true });
            const userData = response.data.user;
            
            const profileInfo = {
                name: userData.fullname || '',
                email: userData.email || '',
                phone: userData.contact || '',
                address: {
                    street: userData.address?.street || '',
                    city: userData.address?.city || '',
                    state: userData.address?.state || '',
                    pincode: userData.address?.pincode || '',
                    country: userData.address?.country || 'India'
                }
            };
            
            setProfileData(profileInfo);
            setOriginalData(JSON.parse(JSON.stringify(profileInfo)));
            
            // Handle profile picture
            if (userData.userpicture && userData.userpicture.data) {
                try {
                    const bufferData = userData.userpicture.data;
                    
                    const blob = new Blob([new Uint8Array(bufferData)], { type: 'image/jpeg' });
                    const reader = new FileReader();
                    
                    reader.onloadend = () => {
                        const base64String = reader.result.split(',')[1];
                        const imageUrl = `data:image/jpeg;base64,${base64String}`;
                        console.log('Profile picture loaded successfully');
                        setProfilePicture(imageUrl);
                        setUser(prev => ({
                            ...prev,
                            profilePic: imageUrl
                        }));
                    };
                    
                    reader.readAsDataURL(blob);
                } catch (error) {
                    console.error('Error processing profile picture:', error);
                }
            } else {
                console.log('No profile picture data found');
            }
            
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data. Please try again.');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProfileData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        try {
            setLoading(true);
            const response = await axios.put(
                `${API}/user/profile`,
                {
                    fullname: profileData.name,
                    contact: profileData.phone,
                    address: profileData.address
                },
                { withCredentials: true }
            );
            
            setUser(response.data.user);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setLoading(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);
        
        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return;
        }
        
        try {
            setLoading(true);
            const response = await axios.put(
                `${API}/user/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                { withCredentials: true }
            );
            
            setPasswordSuccess('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setLoading(false);
        } catch (err) {
            console.error('Error changing password:', err);
            setPasswordError(err.response?.data?.message || 'Failed to change password. Please try again.');
            setLoading(false);
        }
    };

    if (loading && !profileData.name) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Mobile nav toggle */}
            <button
                className="mobile-nav-toggle"
                aria-label="Open menu"
                onClick={() => setIsMobileNavOpen(true)}
            >
                <span className="hamburger"></span>
            </button>
            <div className="profile-layout">
                {/* Enhanced Sidebar */}
                <div className="profile-sidebar">
                    <div className="profile-card">
                        <div className="profile-avatar">
                            <div className="avatar-wrapper">
                                <img
                                    src={profilePicture || user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=000000&color=ffffff&size=120&font-size=0.4`}
                                    alt="Profile"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=000000&color=ffffff&size=120&font-size=0.4`;
                                    }}
                                />
                            </div>
                        </div>
                        <h3 className="profile-name">{profileData.name}</h3>
                        <p className="profile-email">{profileData.email}</p>
                    </div>
                    
                    <nav className="profile-nav">
                        <button
                            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            data-item="profile"
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
                            data-item="security"
                            onClick={() => setActiveTab('password')}
                        >
                            Security
                        </button>
                        <Link to="/orders" className="nav-item" data-item="orders">Orders</Link>
                        <Link to="/wishlist" className="nav-item" data-item="wishlist">Wishlist</Link>
                        <button onClick={logout} className="nav-item logout" data-item="logout">
                            Logout
                        </button>
                    </nav>
                </div>
                
                {/* Enhanced Main Content */}
                <div className="profile-content">
                    {activeTab === 'profile' && (
                        <div className="content-section">
                            <div className="section-header">
                                <div className="header-content">
                                    <h2>Profile Information</h2>
                                    <p className="section-description">Manage your personal information and address details</p>
                                </div>
                                <button
                                    className={`btn-edit ${isEditing ? 'editing' : ''}`}
                                    onClick={() => {
                                        if (isEditing) {
                                            setProfileData(JSON.parse(JSON.stringify(originalData)));
                                        }
                                        setIsEditing(!isEditing);
                                    }}
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>
                            
                            {error && (
                                <div className="alert error">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="alert success">
                                    {success}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="profile-form">
                                <div className="form-section">
                                    <h3 className="form-section-title">Personal Information</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                disabled={true}
                                                className="disabled"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h3 className="form-section-title">Address Information</h3>
                                    <div className="form-group">
                                        <label>Street Address</label>
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={profileData.address.street}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            placeholder="Enter your street address"
                                        />
                                    </div>
                                    
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={profileData.address.city}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your city"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>State</label>
                                            <input
                                                type="text"
                                                name="address.state"
                                                value={profileData.address.state}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your state"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Pincode</label>
                                            <input
                                                type="text"
                                                name="address.pincode"
                                                value={profileData.address.pincode}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your pincode"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Country</label>
                                            <input
                                                type="text"
                                                name="address.country"
                                                value={profileData.address.country}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter your country"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {isEditing && (
                                    <div className="form-actions">
                                        <button
                                            type="submit"
                                            className="btn-save"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                    
                    {activeTab === 'password' && (
                        <div className="content-section">
                            <div className="section-header">
                                <div className="header-content">
                                    <h2>Change Password</h2>
                                    <p className="section-description">Update your password to keep your account secure</p>
                                </div>
                            </div>
                            
                            {passwordError && (
                                <div className="alert error">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="alert success">
                                    {passwordSuccess}
                                </div>
                            )}
                            
                            <form onSubmit={handlePasswordSubmit} className="password-form">
                                <div className="form-section">
                                    <h3 className="form-section-title">Password Update</h3>
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter your current password"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter new password (min 6 characters)"
                                            required
                                            minLength="6"
                                        />
                                        <small className="input-hint">Password must be at least 6 characters long</small>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirm your new password"
                                            required
                                            minLength="6"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn-save"
                                        disabled={loading}
                                    >
                                        {loading ? 'Changing...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
           
        </div>
    );
};

export default UserProfile;