import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useDispatch, useSelector } from 'react-redux';
import { GetCartProduct, RemoveingCartProduct } from '../Redux/AddToCartSlice';
import { useNavigate } from 'react-router-dom';
import { GetallProduct, GetProductFromID, setProduct } from '../Redux/AllProductSlice';
import { useAuth, useCart, API } from '../Contexts/AllContext';
import axios from 'axios';
import '../Style/CartPage.css';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { localCart, removeFromLocalCart, addToLocalCart } = useCart();
    const [productCount, setproductCount] = useState(() => {
        return JSON.parse(localStorage.getItem("cartCounts")) || {};
    });

    const { cartData, loading, error } = useSelector((state) => state.AddToCart);
    const GetProducts = useSelector((state) => state.GetAllProduct);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        dispatch(GetallProduct());

        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [dispatch, isAuthenticated, navigate]);

    const HandleGetCartProduct = () => {
        if (isAuthenticated) {
            let res = dispatch(GetCartProduct());
            res.then((e) => {
                if (e?.payload && Array.isArray(e.payload)) {
                    const uniqueProductIDs = [...new Set(e.payload.map(item => {
                        return typeof item === 'object' && item.productId ? item.productId : item;
                    }))];

                    console.log("Extracted unique product IDs:", uniqueProductIDs);

                    if (uniqueProductIDs.length > 0) {
                        dispatch(GetProductFromID(uniqueProductIDs));
                        console.log("Dispatched GetProductFromID with IDs:", uniqueProductIDs);
                    } else {
                        console.log("No product IDs found in cart data");
                    }
                } else {
                    console.log("Invalid cart data format:", e?.payload);
                }
            });
        } else {
            alert("Please log in to view your cart");
            navigate("/login");
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            HandleGetCartProduct();
        } else {
            navigate("/login");
        }
    }, [dispatch, isAuthenticated, navigate]);

    useEffect(() => {
        if (GetProducts.AllProduct?.products && GetProducts.AllProduct.products.length > 0) {
            console.log("AllProduct loaded with", GetProducts.AllProduct.products.length, "products");

            if (isAuthenticated) {
                HandleGetCartProduct();
            } else {
                navigate("/login");
            }
        }
    }, [GetProducts.AllProduct?.products, isAuthenticated, navigate]);

    useEffect(() => {
        if (GetProducts.product && GetProducts.product.length > 0) {
            console.log("Products loaded:", GetProducts.product);
        }
    }, [GetProducts.product]);

    const increaseCount = (id) => {
        let currentQuantity = 1;
        if (cartData && Array.isArray(cartData)) {
            const cartItem = cartData.find(item =>
                (typeof item === 'object' && item.productId === id) || item === id
            );
            if (cartItem && cartItem.quantity) {
                currentQuantity = cartItem.quantity;
            } else if (productCount[id]) {
                currentQuantity = productCount[id];
            }
        } else if (productCount[id]) {
            currentQuantity = productCount[id];
        }

        const newQuantity = currentQuantity + 1;
        setproductCount((prev) => ({
            ...prev,
            [id]: newQuantity,
        }));

        if (isAuthenticated) {
            const product = GetProducts.product.find(p => p._id === id);
            if (product) {
                const cartItem = cartData.find(item =>
                    (typeof item === 'object' && item.productId === id) || item === id
                );

                axios.put(`${API}/product/cart/update/${id}`, {
                    quantity: newQuantity,
                    size: cartItem?.size || '',
                    color: cartItem?.color || ''
                }, { withCredentials: true })
                    .then(response => {
                        console.log('Quantity updated successfully:', response.data);
                        HandleGetCartProduct();
                    })
                    .catch(error => {
                        console.error('Error updating quantity:', error);
                    });
            }
        }
    };

    const DecreaseCount = (id) => {
        let currentQuantity = 1;
        if (cartData && Array.isArray(cartData)) {
            const cartItem = cartData.find(item =>
                (typeof item === 'object' && item.productId === id) || item === id
            );
            if (cartItem && cartItem.quantity) {
                currentQuantity = cartItem.quantity;
            } else if (productCount[id]) {
                currentQuantity = productCount[id];
            }
        } else if (productCount[id]) {
            currentQuantity = productCount[id];
        }

        const newCount = Math.max(currentQuantity - 1, 1);
        setproductCount((prev) => ({
            ...prev,
            [id]: newCount,
        }));

        if (isAuthenticated) {
            const product = GetProducts.product.find(p => p._id === id);
            if (product) {
                const cartItem = cartData.find(item =>
                    (typeof item === 'object' && item.productId === id) || item === id
                );

                axios.put(`${API}/product/cart/update/${id}`, {
                    quantity: newCount,
                    size: cartItem?.size || '',
                    color: cartItem?.color || ''
                }, { withCredentials: true })
                    .then(response => {
                        console.log('Quantity updated successfully:', response.data);
                        HandleGetCartProduct();
                    })
                    .catch(error => {
                        console.error('Error updating quantity:', error);
                    });
            }
        }
    };

    useEffect(() => {
        localStorage.setItem("cartCounts", JSON.stringify(productCount));
    }, [productCount]);

    useEffect(() => {
        if (cartData && Array.isArray(cartData)) {
            const newProductCount = {};
            cartData.forEach(item => {
                if (typeof item === 'object' && item.productId && item.quantity) {
                    newProductCount[item.productId] = item.quantity;
                } else if (typeof item === 'string') {
                    newProductCount[item] = 1;
                }
            });

            if (Object.keys(newProductCount).length > 0) {
                setproductCount(prev => ({
                    ...prev,
                    ...newProductCount
                }));
            }
        }
    }, [cartData]);

    useEffect(() => {
        if ((error || GetProducts.error) && isAuthenticated) {
            navigate("/login");
        }
    }, [error, GetProducts.error, navigate, isAuthenticated]);

    useEffect(() => {
        console.log("Auth status:", isAuthenticated);
        console.log("GetProducts state:", GetProducts);
        console.log("Local cart:", localCart);
        console.log("All products state:", allProducts);
    }, [isAuthenticated, GetProducts, localCart, allProducts]);

    const uniqueProducts = isAuthenticated ?
        (GetProducts.product && GetProducts.product.length > 0 ?
            GetProducts.product.filter(
                (product, index, self) => index === self.findIndex((p) => p._id === product._id)
            ) : []
        ) : [];

    useEffect(() => {
        console.log("Final products to display:", uniqueProducts);
    }, [uniqueProducts]);

    if ((isAuthenticated && (loading || GetProducts.loading)) || (!isAuthenticated && GetProducts.loading)) {
        return (
            <div className="cart-container">
                <div className="cart-loading">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                    <p>Loading your cart...</p>
                </div>
            </div>
        );
    }

    const HandleRemoveProduct = (id) => {
        if (isAuthenticated) {
            const cartItem = cartData.find(item =>
                (typeof item === 'object' && item.productId === id) || item === id
            );

            axios.post(`${API}/product/cart/remove/${id}`, {
                size: cartItem?.size || '',
                color: cartItem?.color || ''
            }, { withCredentials: true })
                .then(response => {
                    alert("Product Removed From Cart Successfully");
                    HandleGetCartProduct();
                    const updatedProducts = GetProducts.product.filter(product => product._id !== id);
                    dispatch(setProduct(updatedProducts));
                })
                .catch(error => {
                    console.error('Error removing product from cart:', error);
                    if (error.response?.status === 401) {
                        alert("Please log in to use cart features");
                        navigate("/login");
                    } else {
                        alert("Error removing product from cart");
                    }
                });
        } else {
            alert("Please log in to use cart features");
            navigate("/login");
        }
    }

    const handleAddToCart = (productId) => {
        if (isAuthenticated) {
            alert("Please log in to add items to your cart");
            navigate("/login");
        } else {
            alert("Please log in to use cart features");
            navigate("/login");
        }
    }

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate("/checkout");
        } else {
            alert("Please log in to checkout");
            navigate("/login");
        }
    }

    const calculateSubtotal = () => {
        return uniqueProducts.reduce(
            (total, product) => total + (product.price * (productCount[product._id] || 1)),
            0
        );
    };

    const subtotal = calculateSubtotal();

    return (
        <div className="cart-container">
            {/* Page Header */}
            <div className="cart-header">
                <div className="header-content">
                    <h1>Shopping Cart</h1>
                    <p className="header-description">Review and manage your items</p>
                </div>
                <div className="cart-stats">
                    <span className="item-count">{uniqueProducts.length}</span>
                    <span className="item-label">{uniqueProducts.length === 1 ? 'item' : 'items'}</span>
                </div>
            </div>

            <div className="cart-layout">
                {/* Cart Items Section */}
                <div className="cart-items-section">
                    {uniqueProducts && uniqueProducts.length > 0 ? (
                        <div className="items-container">
                            <div className="section-title">
                                <h2>Cart Items</h2>
                                <span className="item-count-badge">{uniqueProducts.length} items</span>
                            </div>
                            
                            <div className="items-list">
                                {uniqueProducts.map((product) => (
                                    <div className="cart-item" key={product._id}>
                                        <div className="item-image">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                        </div>

                                        <div className="item-details">
                                            <div className="item-info">
                                                <h3 className="item-name">{product.name}</h3>
                                                <p className="item-category">{product.category}</p>
                                            </div>
                                            
                                            <div className="item-pricing">
                                                <span className="current-price">₹{product.price}</span>
                                                {product.mrp && product.mrp > product.price && (
                                                    <span className="original-price">₹{product.mrp}</span>
                                                )}
                                            </div>

                                            <div className="quantity-section">
                                                <span className="quantity-label">Quantity</span>
                                                <div className="quantity-controls">
                                                    <button
                                                        className="qty-btn decrease"
                                                        onClick={() => DecreaseCount(product._id)}
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <i className="bi bi-dash"></i>
                                                    </button>
                                                    <span className="quantity">
                                                        {cartData && Array.isArray(cartData) ?
                                                            (cartData.find(item =>
                                                                (typeof item === 'object' && item.productId === product._id) || item === product._id
                                                            )?.quantity || productCount[product._id] || 1) :
                                                            (productCount[product._id] || 1)}
                                                    </span>
                                                    <button
                                                        className="qty-btn increase"
                                                        onClick={() => increaseCount(product._id)}
                                                        aria-label="Increase quantity"
                                                    >
                                                        <i className="bi bi-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="item-actions">
                                            <div className="item-total">
                                                <span className="total-label">Total</span>
                                                <span className="total-amount">
                                                    ₹{(product.price * (cartData && Array.isArray(cartData) ?
                                                        (cartData.find(item =>
                                                            (typeof item === 'object' && item.productId === product._id) || item === product._id
                                                        )?.quantity || productCount[product._id] || 1) :
                                                        (productCount[product._id] || 1))).toFixed(2)}
                                                </span>
                                            </div>
                                            <button
                                                className="remove-btn"
                                                onClick={() => HandleRemoveProduct(product._id)}
                                                aria-label="Remove item"
                                                title="Remove from cart"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="empty-cart">
                            <div className="empty-cart-content">
                                <div className="empty-icon">
                                    <i className="bi bi-cart-x"></i>
                                </div>
                                <h2>Your cart is empty</h2>
                                <p>Looks like you haven't added any items yet</p>
                                <button className="shop-btn" onClick={() => navigate('/')}>
                                    <i className="bi bi-arrow-left"></i>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary Section */}
                {uniqueProducts && uniqueProducts.length > 0 && (
                    <div className="cart-summary-section">
                        <div className="summary-card">
                            <div className="summary-header">
                                <h2>Order Summary</h2>
                                <div className="summary-icon">
                                    <i className="bi bi-receipt"></i>
                                </div>
                            </div>

                            <div className="summary-details">
                                <div className="summary-row">
                                    <span className="row-label">Subtotal</span>
                                    <span className="row-value">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="row-label">Shipping</span>
                                    <span className="row-value free">Free</span>
                                </div>
                                <div className="summary-row total">
                                    <span className="row-label">Total</span>
                                    <span className="row-value">₹{subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="summary-actions">
                                <button
                                    className="checkout-btn"
                                    onClick={handleCheckout}
                                >
                                    {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                                </button>
                                
                                <div className="secure-checkout">
                                    <i className="bi bi-shield-check"></i>
                                    <span>Secure checkout</span>
                                </div>
                            </div>

                            <div className="payment-methods">
                                <span className="payment-label">We accept</span>
                                <div className="payment-icons">
                                    <i className="bi bi-credit-card" title="Credit Card"></i>
                                    <i className="bi bi-paypal" title="PayPal"></i>
                                    <i className="bi bi-wallet2" title="Digital Wallet"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;