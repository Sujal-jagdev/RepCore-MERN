import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API, useAuth } from '../Contexts/AllContext';
import { AddProductToCart } from '../Redux/AddToCartSlice';
import '../Style/ProductDetail.css';
// Import Bootstrap Icons CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

const ProductDetail = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addingToWishlist, setAddingToWishlist] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ''
    });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [reviewError, setReviewError] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomOrigin, setZoomOrigin] = useState({ x: '50%', y: '50%' });

    useEffect(() => {
        fetchProductDetails();
        fetchProductReviews();
    }, [id]);
    
    // Calculate average rating from reviews and update product rating
    useEffect(() => {
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const avgRating = totalRating / reviews.length;
            setAverageRating(avgRating);
            
            // Update product rating in state if it differs from calculated average
            if (product && Math.abs((product.rating || 0) - avgRating) > 0.1) {
                setProduct(prevProduct => ({
                    ...prevProduct,
                    rating: avgRating
                }));
            }
        }
    }, [reviews, product]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API}/product/getoneproduct/${id}`);
            const productData = response.data.product;
            const relatedData = response.data.relatedProducts || [];
            
            setProduct(productData);
            setRelatedProducts(relatedData);
            
            // Set default selected options
            if (productData.image) {
                setSelectedImage(productData.image);
            }
            
            if (productData.colors && productData.colors.length > 0) {
                setSelectedColor(productData.colors[0]);
            }
            
            if (productData.sizes && productData.sizes.length > 0) {
                setSelectedSize(productData.sizes[0]);
            }
            
            setLoading(false);
        } catch (err) {
            console.error('Error fetching product details:', err);
            setError('Failed to load product details. Please try again.');
            setLoading(false);
        }
    };
    
    const fetchProductReviews = async () => {
        try {
            const response = await axios.get(`${API}/product/review/product/${id}`);
            if (response.data.success) {
                // Filter only approved reviews
                const approvedReviews = response.data.reviews
                setReviews(approvedReviews);
                console.log('Fetched reviews:', approvedReviews);
            }
        } catch (err) {
            console.error('Error fetching product reviews:', err);
            // Don't set error state here to avoid blocking the whole page if only reviews fail
        }
    };

    const handleImageMouseMove = (e) => {
        if (!isZoomed) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomOrigin({ x: `${x}%`, y: `${y}%` });
    };

    const handleImageEnter = () => setIsZoomed(true);
    const handleImageLeave = () => setIsZoomed(false);
    const handleImageClick = () => setIsZoomed((z) => !z);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert('Please login to add items to your cart');
            return;
        }
        
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }
        
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            alert('Please select a color');
            return;
        }
        
        try {
            setAddingToCart(true);
            
            // Use Redux action instead of direct axios call for live cart updates
            const resultAction = await dispatch(AddProductToCart({
                productId: id,
                quantity,
                color: selectedColor,
                size: selectedSize
            }));
            
            if (AddProductToCart.fulfilled.match(resultAction)) {
                // Success - cart count will update automatically via Redux
                console.log('Product added to cart successfully');
                setAddingToCart(false);
            } else if (AddProductToCart.rejected.match(resultAction)) {
                // Handle error
                console.error('Failed to add product to cart:', resultAction.payload);
                setAddingToCart(false);
                alert(resultAction.payload || 'Failed to add product to cart. Please try again.');
            }
            
        } catch (err) {
            console.error('Error adding to cart:', err);
            setAddingToCart(false);
            alert('Failed to add product to cart. Please try again.');
        }
    };

    const handleAddToWishlist = async () => {
        if (!isAuthenticated) {
            alert('Please login to add items to your wishlist');
            return;
        }
        
        try {
            setAddingToWishlist(true);
            await axios.post(`${API}/product/wishlist/add/${id}`, {}, { withCredentials: true });
            setAddingToWishlist(false);
        
        } catch (err) {
            console.error('Error adding to wishlist:', err);
            setAddingToWishlist(false);
            alert('Failed to add product to wishlist. Please try again.');
        }
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewForm(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
        }));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            alert('Please login to submit a review');
            return;
        }
        
        if (!reviewForm.comment.trim()) {
            setReviewError('Please enter a review comment');
            return;
        }
        
        try {
            setReviewSubmitting(true);
            setReviewError(null);
            
            const response = await axios.post(`${API}/product/review/${id}`, {
                rating: reviewForm.rating,
                comment: reviewForm.comment
            }, { withCredentials: true });
            
            // If the review was added successfully, update the reviews list
            if (response.data && response.data.review) {
                // Add the new review to the reviews list if it's approved immediately
                if (response.data.review.status === 'approved') {
                    setReviews(prevReviews => [...prevReviews, response.data.review]);
                }
                
                // Refresh reviews from backend
                fetchProductReviews();
            }
            
            setReviewSubmitting(false);
            setReviewSuccess(true);
            setReviewForm({
                rating: 5,
                comment: ''
            });
            
            // Show success message for 3 seconds
            setTimeout(() => {
                setReviewSuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Error submitting review:', err);
            setReviewSubmitting(false);
            setReviewError(err.response?.data?.message || 'Failed to submit review. Please try again.');
        }
    };

    const renderStarRating = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i 
                    key={i} 
                    className={`bi ${i <= rating ? 'bi-star-fill' : 'bi-star'} ${i <= rating ? 'text-warning' : ''}`}
                ></i>
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="container mt-5 pt-5 text-center">
                <div className="spinner-border" role="status"></div>
                <p className="mt-3">Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mt-5 pt-5">
                <div className="alert alert-danger" role="alert">
                    {error || 'Product not found'}
                </div>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/"><i className="bi bi-house-door"></i> Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/${product.category.toLowerCase()}s`}>{product.category}</Link></li>
                    {product.subcategory && (
                        <li className="breadcrumb-item"><Link to={`/${product.category.toLowerCase()}s?subcategory=${product.subcategory}`}>{product.subcategory}</Link></li>
                    )}
                    <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                </ol>
            </nav>

            <div className="row">
                {/* Product Images */}
                <div className="col-md-6 mb-4">
                    <div className="product-gallery">
                        <div className="main-image-container" onMouseEnter={handleImageEnter} onMouseLeave={handleImageLeave} onMouseMove={handleImageMouseMove} onClick={handleImageClick}>
                            {/* Product Badge */}
                            {product.mrp && product.mrp > product.price && (
                                <div className="product-badge badge-sale">
                                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                                </div>
                            )}
                            
                            {/* Main Image */}
                            <img 
                                src={selectedImage || product.image} 
                                alt={product.name} 
                                className="main-image" 
                                style={{ transform: isZoomed ? 'scale(2)' : 'scale(1)', transformOrigin: `${zoomOrigin.x} ${zoomOrigin.y}`, transition: 'transform 0.2s ease', cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
                            />
                            
                            {/* Zoom Icon */}
                            <div className="image-zoom-overlay" title="Click to zoom">
                                <i className="bi bi-zoom-in"></i>
                            </div>
                        </div>
                        
                        {/* Image Gallery */}
                        {product.gallery && product.gallery.length > 0 && (
                            <div className="thumbnail-gallery row g-2 mt-3">
                                <div className="col-3">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className={`thumbnail ${selectedImage === product.image ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(product.image)}
                                    />
                                </div>
                                {product.gallery.map((img, index) => (
                                    <div className="col-3" key={index}>
                                        <img 
                                            src={img} 
                                            alt={`${product.name} - ${index + 1}`} 
                                            className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(img)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Product Details */}
                <div className="col-md-6">
                    <div className="product-info">
                        <h2 className="product-title">{product.name}</h2>
                        
                        <div className="product-rating">
                            <div className="rating-stars">
                                {renderStarRating(product.rating || 0)}
                            </div>
                            <span className="rating-count">
                                {product.rating ? product.rating.toFixed(1) : '0'} ({reviews.length} reviews)
                            </span>
                        </div>
                        
                        <div className="product-price">
                            <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
                            {product.mrp && product.mrp > product.price && (
                                <>
                                    <span className="original-price">₹{product.mrp.toLocaleString('en-IN')}</span>
                                            <span className="discount-badge">
                                                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                                            </span>
                                </>
                            )}
                        </div>
                        
                        
                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-4">
                                <h6 className="option-title"><i className="bi bi-palette"></i> Colors</h6>
                                <div className="color-options">
                                    {product.colors.map((color, index) => (
                                        <div 
                                            key={index} 
                                            className={`color-option ${selectedColor === color ? 'selected' : ''}`} 
                                            style={{ backgroundColor: color }}
                                            onClick={() => setSelectedColor(color)}
                                            title={color}
                                        >
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-4">
                                <h6 className="option-title"><i className="bi bi-rulers"></i> Size</h6>
                                <div className="size-options">
                                    {product.sizes.map((size, index) => (
                                        <div 
                                            key={index} 
                                            className={`size-option ${selectedSize === size ? 'selected' : ''}`} 
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Quantity Selection */}
                        <div className="mb-4">  
                            <div className="quantity-selector">
                                <button 
                                    className="quantity-btn minus"
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={product.stock <= 0}
                                >
                                    <i className="bi bi-dash"></i>
                                </button>
                                <input 
                                    type="number" 
                                    className="quantity-input" 
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    max={product.stock}
                                    disabled={product.stock <= 0}
                                />
                                <button 
                                    className="quantity-btn plus"
                                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                                    disabled={quantity >= product.stock || product.stock <= 0}
                                >
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                            
                            {/* Stock Status */}
                            <div className="stock-status">
                                {product.stock > 0 ? (
                                    product.stock < 10 ? (
                                        <span className="low-stock">
                                            <i className="bi bi-exclamation-triangle"></i> Only {product.stock} left in stock
                                        </span>
                                    ) : (
                                        <span className="in-stock">
                                            <i className="bi bi-check-circle"></i> In Stock
                                        </span>
                                    )
                                ) : (
                                    <span className="out-of-stock">
                                        <i className="bi bi-x-circle"></i> Out of Stock
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button 
                                className="btn-add-to-cart"
                                onClick={handleAddToCart}
                                disabled={addingToCart || product.stock <= 0}
                            >
                                {addingToCart ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-cart-plus"></i>
                                        Add to Cart
                                    </>
                                )}
                            </button>
                            
                            <button 
                                className="btn-wishlist"
                                onClick={handleAddToWishlist}
                                disabled={addingToWishlist}
                                title="Add to Wishlist"
                            >
                                {addingToWishlist ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <i className="bi bi-heart"></i>
                                )}
                            </button>
                        </div>
                        
                        {/* Product Metadata */}
                        <div className="product-meta mt-4">
                            <div className="meta-item">
                                <span className="meta-label"><i className="bi bi-tag"></i> Category:</span>
                                <span className="meta-value">{product.category}</span>
                            </div>
                            {product.subcategory && (
                                <div className="meta-item">
                                    <span className="meta-label"><i className="bi bi-tags"></i> Subcategory:</span>
                                    <span className="meta-value">{product.subcategory}</span>
                                </div>
                            )}
                            <div className="meta-item">
                                <span className="meta-label"><i className="bi bi-upc"></i> SKU:</span>
                                <span className="meta-value">{product._id.substring(0, 8).toUpperCase()}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            
            {/* Product Description and Reviews Tabs */}
            <div className="row mt-5">
                <div className="col-12">
                    <ul className="nav nav-tabs" id="productTabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button 
                                className="nav-link active" 
                                id="description-tab" 
                                data-bs-toggle="tab" 
                                data-bs-target="#description" 
                                type="button" 
                                role="tab" 
                                aria-controls="description" 
                                aria-selected="true"
                            >
                                Description
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className="nav-link" 
                                id="reviews-tab" 
                                data-bs-toggle="tab" 
                                data-bs-target="#reviews" 
                                type="button" 
                                role="tab" 
                                aria-controls="reviews" 
                                aria-selected="false"
                            >
                                Reviews ({reviews.length})
                            </button>
                        </li>
                    </ul>
                    
                    <div className="tab-content p-4 border border-top-0 rounded-bottom" id="productTabsContent">
                        <div 
                            className="tab-pane fade show active" 
                            id="description" 
                            role="tabpanel" 
                            aria-labelledby="description-tab"
                        >
                            <div className="row">
                                <div className="col-md-8">
                                    {product.description ? (
                                        <div>
                                            <h4>Product Description</h4>
                                            <p>{product.description}</p>
                                        </div>
                                    ) : (
                                        <p className="text-muted">No detailed description available for this product.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            className="tab-pane fade" 
                            id="reviews" 
                            role="tabpanel" 
                            aria-labelledby="reviews-tab"
                        >
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="review-summary">
                                        <h4 className="mb-3">Ratings & Reviews</h4>
                                        <div className="overall-rating mb-4">
                                            <div className="rating-number">
                                                {product.rating ? product.rating.toFixed(1) : '0'}
                                                <span className="rating-max">/5</span>
                                            </div>
                                            <div className="rating-stars-large mb-2">
                                                {renderStarRating(product.rating || 0)}
                                            </div>
                                            <div className="rating-count">
                                                {reviews.length} Reviews
                                            </div>
                                        </div>
                                        
                                        {/* Rating Breakdown */}
                                        <div className="rating-breakdown">
                                            {[5, 4, 3, 2, 1].map(star => {
                                                // Calculate how many reviews have this star rating
                                                const count = reviews.filter(review => review.rating === star).length;
                                                // Calculate percentage
                                                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                                
                                                return (
                                                    <div className="rating-bar" key={star}>
                                                        <div className="rating-label">{star} <i className="bi bi-star-fill"></i></div>
                                                        <div className="progress">
                                                            <div 
                                                                className="progress-bar" 
                                                                role="progressbar" 
                                                                style={{ width: `${percentage}%` }}
                                                                aria-valuenow={percentage} 
                                                                aria-valuemin="0" 
                                                                aria-valuemax="100"
                                                            ></div>
                                                        </div>
                                                        <div className="rating-count-small">{count}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-md-8">
                                    <h4 className="mb-4">Customer Reviews</h4>
                                    
                                    {reviews.length === 0 ? (
                                        <div className="no-reviews">
                                            <i className="bi bi-chat-square-text"></i>
                                            <p>No reviews yet. Be the first to review this product!</p>
                                        </div>
                                    ) : (
                                        <div className="reviews-list">
                                            {reviews.map((review, index) => (
                                                <div key={index} className="review-item">
                                                    <div className="review-header">
                                                        <div className="reviewer-info">
                                                            <div className="reviewer-avatar">
                                                                <i className="bi bi-person-circle"></i>
                                                            </div>
                                                            <div>
                                                                <h6 className="reviewer-name">{review.user?.name || 'Anonymous User'}</h6>
                                                                <div className="review-date">
                                                                    <i className="bi bi-calendar3"></i> {new Date(review.createdAt).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="review-rating">
                                                            {renderStarRating(review.rating)}
                                                            <span className="rating-value">{review.rating}.0</span>
                                                        </div>
                                                    </div>
                                                    <div className="review-content">
                                                        <p>{review.comment}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <div className="add-review">
                                        <h5 className="review-form-title">
                                            <i className="bi bi-pencil-square"></i> Write a Review
                                        </h5>
                                        
                                        {reviewSuccess && (
                                            <div className="alert alert-success" role="alert">
                                                <i className="bi bi-check-circle-fill"></i> Thank you for your review! It has been submitted for approval.
                                            </div>
                                        )}
                                        
                                        {reviewError && (
                                            <div className="alert alert-danger" role="alert">
                                                <i className="bi bi-exclamation-triangle-fill"></i> {reviewError}
                                            </div>
                                        )}
                                        
                                        {!isAuthenticated ? (
                                            <div className="login-prompt">
                                                <i className="bi bi-lock"></i>
                                                <p>Please <Link to="/login">login</Link> to write a review.</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleReviewSubmit} className="review-form">
                                                <div className="mb-3">
                                                    <label htmlFor="rating" className="form-label">Your Rating</label>
                                                    <div className="star-rating-select">
                                                        {[5, 4, 3, 2, 1].map(star => (
                                                            <div 
                                                                key={star} 
                                                                className={`star-option ${parseInt(reviewForm.rating) >= star ? 'selected' : ''}`}
                                                                onClick={() => setReviewForm({...reviewForm, rating: star.toString()})}
                                                            >
                                                                <i className="bi bi-star-fill"></i>
                                                            </div>
                                                        ))}
                                                        <span className="rating-text">
                                                            {reviewForm.rating === '5' ? 'Excellent' : 
                                                             reviewForm.rating === '4' ? 'Very Good' : 
                                                             reviewForm.rating === '3' ? 'Good' : 
                                                             reviewForm.rating === '2' ? 'Fair' : 
                                                             reviewForm.rating === '1' ? 'Poor' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <label htmlFor="comment" className="form-label">Your Review</label>
                                                    <textarea 
                                                        className="form-control" 
                                                        id="comment" 
                                                        name="comment"
                                                        rows="4"
                                                        placeholder="Share your experience with this product..."
                                                        value={reviewForm.comment}
                                                        onChange={handleReviewChange}
                                                        required
                                                    ></textarea>
                                                </div>
                                                
                                                <button 
                                                    type="submit" 
                                                    className="btn-submit-review"
                                                    disabled={reviewSubmitting}
                                                >
                                                    {reviewSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-send"></i> Submit Review
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="related-products mt-5">
                    <h3 className="mb-4">Related Products</h3>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                        {relatedProducts.map(relatedProduct => (
                            <div className="col" key={relatedProduct._id}>
                                <div className="card h-100">
                                    <Link to={`/product/${relatedProduct._id}`}>
                                        <img 
                                            src={relatedProduct.image} 
                                            className="card-img-top" 
                                            alt={relatedProduct.name}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    </Link>
                                    <div className="card-body">
                                        <Link to={`/product/${relatedProduct._id}`} className="text-decoration-none text-dark">
                                            <h5 className="card-title">{relatedProduct.name}</h5>
                                        </Link>
                                        <p className="card-text text-muted mb-1">{relatedProduct.category}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="fw-bold">₹{relatedProduct.price}</span>
                                                {relatedProduct.mrp && relatedProduct.mrp > relatedProduct.price && (
                                                    <span className="text-decoration-line-through text-muted ms-2">₹{relatedProduct.mrp}</span>
                                                )}
                                            </div>
                                            {relatedProduct.mrp && relatedProduct.mrp > relatedProduct.price && (
                                                <span className="badge bg-success">
                                                    {Math.round(((relatedProduct.mrp - relatedProduct.price) / relatedProduct.mrp) * 100)}% OFF
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;