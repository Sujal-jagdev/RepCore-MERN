import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API, useAuth } from '../Contexts/AllContext';
import './Wishlist.css'; // Import custom CSS for wishlist page

const Wishlist = () => {
    const { isAuthenticated } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError(null); // Clear any previous errors
            
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                setLoading(false);
                return;
            }
            
            // Set authorization header with token
            const response = await axios.get(`${API}/product/wishlist`, { 
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setWishlistItems(response.data.wishlist || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching wishlist:', err);
            setError('Failed to load wishlist. Please try again.');
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }
            
            await axios.delete(`${API}/product/wishlist/remove/${productId}`, { 
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Update the wishlist after removal
            setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
        } catch (err) {
            console.error('Error removing from wishlist:', err);
            setError('Failed to remove item from wishlist. Please try again.');
        }
    };

    const handleAddToCart = async (product) => {
        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                return;
            }
            
            // Default to first color and size if available
            const color = product.colors && product.colors.length > 0 ? product.colors[0] : null;
            const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
            
            await axios.post(`${API}/product/addtocart/${product._id}`, {
                color,
                size,
                quantity: 1
            }, { 
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Show success message
            alert('Product added to cart!');
            
            // Optionally remove from wishlist after adding to cart
            // handleRemoveFromWishlist(product._id);
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('Failed to add to cart. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 pt-5 text-center">
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                    <p className="mt-4 fw-bold">Loading your wishlist...</p>
                    <p className="text-muted">Please wait while we fetch your saved items</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Your Wishlist</h2>
                <Link to="/profile" className="btn btn-outline-secondary">
                    <i className="bi bi-person-circle me-2"></i>
                    <span>Back to Profile</span>
                </Link>
            </div>
            
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            
            {!isAuthenticated ? (
                <div className="text-center p-5 bg-light rounded shadow-sm">
                    <i className="bi bi-person-lock text-primary" style={{ fontSize: '4rem' }}></i>
                    <h4 className="mt-3 fw-bold">Please Login to View Your Wishlist</h4>
                    <p className="text-muted">You need to be logged in to use the wishlist feature.</p>
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <Link to="/login" className="btn btn-primary px-4">
                            <i className="bi bi-box-arrow-in-right me-2"></i>Login
                        </Link>
                        <Link to="/" className="btn btn-outline-secondary px-4">
                            <i className="bi bi-shop me-2"></i>Continue Shopping
                        </Link>
                    </div>
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="text-center p-5 bg-light rounded shadow-sm">
                    <i className="bi bi-heart text-danger" style={{ fontSize: '4rem' }}></i>
                    <h4 className="mt-3 fw-bold">Your Wishlist is Empty</h4>
                    <p className="text-muted">Save items you like by clicking the heart icon on product pages.</p>
                    <div className="mt-4">
                        <Link to="/" className="btn btn-primary px-4">
                            <i className="bi bi-shop me-2"></i>Continue Shopping
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {wishlistItems.map(item => (
                        <div className="col" key={item._id}>
                            <div className="card h-100 shadow-sm hover-shadow">
                                <div className="position-relative">
                                    <Link to={`/product/${item._id}`}>
                                        <img 
                                            src={item.image} 
                                            className="card-img-top" 
                                            alt={item.name}
                                            style={{ height: '250px', objectFit: 'cover' }}
                                        />
                                    </Link>
                                    <button 
                                        className="btn btn-sm position-absolute top-0 end-0 m-2 bg-white rounded-circle p-2 shadow-sm"
                                        onClick={() => handleRemoveFromWishlist(item._id)}
                                        title="Remove from wishlist"
                                    >
                                        <i className="bi bi-x" style={{ fontSize: '1.2rem' }}></i>
                                    </button>
                                    {item.mrp && item.mrp > item.price && (
                                        <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                                            {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                
                                <div className="card-body">
                                    <Link to={`/product/${item._id}`} className="text-decoration-none text-dark">
                                        <h5 className="card-title text-truncate">{item.name}</h5>
                                    </Link>
                                    <p className="card-text text-muted mb-1">{item.category}</p>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <span className="fw-bold fs-5">₹{item.price}</span>
                                            {item.mrp && item.mrp > item.price && (
                                                <span className="text-decoration-line-through text-muted ms-2">₹{item.mrp}</span>
                                            )}
                                        </div>
                                        
                                    </div>
                                    
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        {/* Available colors */}
                                        {item.colors && item.colors.length > 0 && (
                                            <div>
                                                <small className="text-muted d-block mb-1">Colors</small>
                                                <div className="d-flex gap-1">
                                                    {item.colors.slice(0, 4).map((color, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            className="rounded-circle border" 
                                                            style={{
                                                                backgroundColor: color,
                                                                width: '20px',
                                                                height: '20px'
                                                            }}
                                                            title={color}
                                                        ></div>
                                                    ))}
                                                    {item.colors.length > 4 && (
                                                        <div className="rounded-circle border d-flex align-items-center justify-content-center" 
                                                            style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                                            title="More colors available">
                                                            +{item.colors.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Available sizes */}
                                        {item.sizes && item.sizes.length > 0 && (
                                            <div>
                                                <small className="text-muted d-block mb-1">Sizes</small>
                                                <div className="d-flex gap-1">
                                                    {item.sizes.slice(0, 3).map((size, idx) => (
                                                        <span key={idx} className="border rounded px-2 py-1" style={{ fontSize: '0.7rem' }}>
                                                            {size}
                                                        </span>
                                                    ))}
                                                    {item.sizes.length > 3 && (
                                                        <span className="border rounded px-2 py-1" style={{ fontSize: '0.7rem' }}>
                                                            +{item.sizes.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="card-footer bg-white border-top-0 d-flex gap-2">
                                    <button 
                                        className="btn btn-primary flex-grow-1"
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        <i className="bi bi-cart-plus me-2"></i>Add to Cart
                                    </button>
                                    <Link 
                                        to={`/product/${item._id}`} 
                                        className="btn btn-outline-secondary"
                                        title="View Details"
                                    >
                                        <i className="bi bi-eye"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;