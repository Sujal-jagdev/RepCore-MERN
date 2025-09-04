import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, useAuth } from '../Contexts/AllContext';
import { GetCartProduct } from '../Redux/AddToCartSlice';
import { GetProductFromID } from '../Redux/AllProductSlice';
import { toast } from 'react-toastify';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartProducts, setCartProducts] = useState([]);
    const [productCount, setProductCount] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Online');
    const [orderProcessing, setOrderProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    // Address form state
    const [address, setAddress] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        country: 'India'
    });

    // Saved addresses state
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [addressesLoading, setAddressesLoading] = useState(false);
    const [addressesError, setAddressesError] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(true);

    // Check authentication and redirect if not logged in
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const hasPaymentReturn = !!urlParams.get('order_id');
        if (!isAuthenticated && !hasPaymentReturn) {
            navigate('/login', { state: { from: '/checkout', message: 'Please login to access checkout' } });
        }
    }, [isAuthenticated, navigate]);

    // Get cart products
    useEffect(() => {
        if (isAuthenticated) {
            fetchCartData();
            fetchUserAddresses();
            
            // Check if there's a pending payment from URL params
            const urlParams = new URLSearchParams(window.location.search);
            const pendingOrderId = urlParams.get('order_id');
            const pendingOrderToken = urlParams.get('order_token');

            // Trigger verification if order_id is present; token is optional
            if (pendingOrderId) {
                // returning from gateway
                checkPendingPaymentStatus(pendingOrderId);
            }
        }
    }, [isAuthenticated]);

    // Check pending payment status when returning to checkout
    const checkPendingPaymentStatus = async (orderId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API}/payment/verify/${orderId}`, {
                withCredentials: true
            });
            
            if (response.data && (response.data.order_status === 'PAID' || response.data.order_status === 'SUCCESS' || response.data.order_status === 'COMPLETED')) {
                // Payment was successful, show success state
                setOrderSuccess(true);
                setOrderId(orderId);
                setLoading(false);
                toast.success('Payment successful! Your order has been placed.');
                
                // Clear cart
                localStorage.removeItem('cartCounts');
                try {
                    await axios.delete(`${API}/product/cart/clear`, { withCredentials: true });
                } catch (clearCartError) {
                    // ignore clear cart errors silently
                }
                dispatch(GetCartProduct());
            } else if (response.data && response.data.order_status === 'ACTIVE') {
                // Payment still pending, start periodic checking
                setLoading(false);
                setError('Payment is still being processed. Starting verification...');
                toast.info('Payment is still being processed. Starting verification...');
                startPeriodicPaymentCheck(orderId);
            } else {
                // Payment failed or other status
                setLoading(false);
                setError(`Payment status: ${response.data?.order_status || 'Unknown'}. Please try again.`);
                toast.error(`Payment status: ${response.data?.order_status || 'Unknown'}. Please try again.`);
            }
        } catch (error) {
            // swallow verify errors, UI will handle
            setLoading(false);
            setError('Failed to check payment status. Please try again.');
            toast.error('Failed to check payment status. Please try again.');
        }
    };

    // Fetch cart data function
    const fetchCartData = async () => {
        try {
            setLoading(true);
            setError('');

            // First get cart items
            const cartResponse = await axios.get(`${API}/product/cart`, { withCredentials: true });

            if (cartResponse.data && cartResponse.data.cart && cartResponse.data.cart.length > 0) {
                // Get detailed product information for each cart item
                const productDetails = [];
                const quantities = {};

                for (const item of cartResponse.data.cart) {
                    try {
                        // Check if productId is already populated or just an ID
                        if (typeof item.productId === 'object' && item.productId._id) {
                            // Already populated
                            productDetails.push(item.productId);
                            quantities[item.productId._id] = item.quantity || 1;
                        } else {
                            // Need to fetch product details
                            const productResponse = await axios.get(`${API}/product/getoneproduct/${item.productId}`, { withCredentials: true });
                            if (productResponse.data) {
                                const product = productResponse.data.product || productResponse.data;
                                productDetails.push(product);
                                quantities[product._id] = item.quantity || 1;
                            }
                        }
                    } catch (err) {
                        // ignore individual product errors
                        toast.error(`Could not load product details for one item`);
                    }
                }

                if (productDetails.length > 0) {
                    setCartProducts(productDetails);
                    setProductCount(quantities);
                } else {
                    setCartProducts([]);
                    setError('No products found in cart');
                }
            } else {
                setCartProducts([]);
            }

            setLoading(false);
        } catch (error) {
            // ignore cart fetch error; UI shows a message
            setError('Failed to load your cart. Please try again.');
            setLoading(false);
        }
    };

    // Fetch user's saved addresses
    useEffect(() => {
        if (isAuthenticated) {
            fetchUserAddresses();
        }
    }, [isAuthenticated]);

    // Fetch user's saved addresses
    const fetchUserAddresses = async () => {
        try {
            setAddressesLoading(true);
            setAddressesError('');

            const response = await axios.get(`${API}/user/addresses`, { withCredentials: true });
            
            if (response.data && response.data.addresses) {
                setSavedAddresses(response.data.addresses);

                // If there's a default address, select it
                const defaultAddress = response.data.addresses.isDefault === "true"
                    ? response.data.addresses
                    : null;

                
                if (defaultAddress) {
                    setSelectedAddressId(defaultAddress._id);
                    setAddress({
                        name: defaultAddress.name,
                        street: defaultAddress.street,
                        city: defaultAddress.city,
                        state: defaultAddress.state,
                        pincode: defaultAddress.pincode,
                        country: defaultAddress.country || 'India',
                        phone: defaultAddress.phone
                    });
                    setShowAddressForm(false);
                } else if (response.data.addresses.length > 0) {
                    // If no default but addresses exist, select the first one
                    const firstAddress = response.data.addresses[0];
                    setSelectedAddressId(firstAddress._id);
                    setAddress({
                        name: firstAddress.name,
                        street: firstAddress.street,
                        city: firstAddress.city,
                        state: firstAddress.state,
                        pincode: firstAddress.pincode,
                        country: firstAddress.country || 'India',
                        phone: firstAddress.phone
                    });
                    setShowAddressForm(false);
                } else {
                    // No addresses found, show the form
                    setShowAddressForm(true);
                }
            } else {
                // No addresses in response
                setSavedAddresses([]);
                setShowAddressForm(true);
            }

            setAddressesLoading(false);
        } catch (error) {
            
            setAddressesError('Failed to load your saved addresses');
            setSavedAddresses([]);
            setShowAddressForm(true);
            setAddressesLoading(false);
        }
    };

    // Calculate total amount
    useEffect(() => {
        if (cartProducts.length > 0) {
            const total = cartProducts.reduce((sum, product) => {
                const count = productCount[product._id] || 1;
                return sum + (product.price * count);
            }, 0);
            setTotalAmount(total);
        }
    }, [cartProducts, productCount]);

    // Fetch cart data is already defined above
    // This section was causing a duplicate declaration error

    // Handle address form change
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle payment method change
    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    // Handle selecting a saved address
    const handleSelectAddress = (addressId) => {
        const selectedAddress = savedAddresses.find(addr => addr._id === addressId);
        if (selectedAddress) {
            setSelectedAddressId(addressId);
            setAddress({
                name: selectedAddress.name,
                street: selectedAddress.street,
                city: selectedAddress.city,
                state: selectedAddress.state,
                pincode: selectedAddress.pincode,
                country: selectedAddress.country || 'India',
                phone: selectedAddress.phone
            });
            setShowAddressForm(false);
        }
    };

    // Toggle address form visibility
    const toggleAddressForm = () => {
        if (!showAddressForm) {
            // Reset form when showing it for a new address
            setSelectedAddressId('');
            setAddress({
                name: '',
                street: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India',
                phone: ''
            });
        }
        setShowAddressForm(!showAddressForm);
    };

    // Save a new address
    const handleSaveAddress = async (e) => {
        e.preventDefault();

        try {
            // Validate all required fields
            if (!address.name || !address.street || !address.city || !address.state || !address.pincode || !address.phone) {
                toast.error('Please fill all required address fields');
                return;
            }

            // Validate phone number format
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(address.phone)) {
                toast.error('Please enter a valid 10-digit phone number');
                return;
            }

            // Validate pincode format
            const pincodeRegex = /^[0-9]{6}$/;
            if (!pincodeRegex.test(address.pincode)) {
                toast.error('Please enter a valid 6-digit pincode');
                return;
            }

            const response = await axios.post(`${API}/user/addresses`, {
                ...address,
                isDefault: savedAddresses.length === 0 // Make it default if it's the first address
            }, { withCredentials: true });

            if (response.data && response.data.addresses) {
                setSavedAddresses(response.data.addresses);
                const newAddress = response.data.addresses[response.data.addresses.length - 1];
                setSelectedAddressId(newAddress._id);
                toast.success('Address saved successfully');
                setShowAddressForm(false);
            }
        } catch (error) {
            
            toast.error(error.response?.data?.message || 'Failed to save address');
        }
    };

    // Set an address as default
    const handleSetDefaultAddress = async (addressId) => {
        try {
            const response = await axios.put(`${API}/user/addresses/${addressId}`, {
                isDefault: true
            }, { withCredentials: true });

            if (response.data && response.data.addresses) {
                setSavedAddresses(response.data.addresses);
                toast.success('Default address updated');
            }
        } catch (error) {
            
            toast.error('Failed to update default address');
        }
    };

    // Delete an address
    const handleDeleteAddress = async (addressId) => {
        try {
            if (window.confirm('Are you sure you want to delete this address?')) {
                const response = await axios.delete(`${API}/user/addresses/${addressId}`, { withCredentials: true });

                if (response.data) {
                    setSavedAddresses(response.data.addresses);

                    // If the deleted address was selected, select another one if available
                    if (addressId === selectedAddressId) {
                        if (response.data.addresses.length > 0) {
                            const newSelectedAddress = response.data.addresses[0];
                            setSelectedAddressId(newSelectedAddress._id);
                            setAddress({
                                name: newSelectedAddress.name,
                                street: newSelectedAddress.street,
                                city: newSelectedAddress.city,
                                state: newSelectedAddress.state,
                                pincode: newSelectedAddress.pincode,
                                country: newSelectedAddress.country || 'India',
                                phone: newSelectedAddress.phone
                            });
                        } else {
                            setSelectedAddressId('');
                            setAddress({
                                name: '',
                                street: '',
                                city: '',
                                state: '',
                                pincode: '',
                                country: 'India',
                                phone: ''
                            });
                            setShowAddressForm(true);
                        }
                    }

                    toast.success('Address deleted successfully');
                }
            }
        } catch (error) {
            
            toast.error('Failed to delete address');
        }
    };

    // Form validation functions
    const validateName = (name) => {
        if (!name) return "Name is required";
        if (name.length < 3) return "Name must be at least 3 characters";
        return "";
    };

    const validateStreet = (street) => {
        if (!street) return "Street address is required";
        if (street.length < 5) return "Please enter a valid street address";
        return "";
    };

    const validateCity = (city) => {
        if (!city) return "City is required";
        return "";
    };

    const validateState = (state) => {
        if (!state) return "State is required";
        return "";
    };

    const validatePincode = (pincode) => {
        if (!pincode) return "Pincode is required";
        if (!/^\d{6}$/.test(pincode)) return "Pincode must be 6 digits";
        return "";
    };

    const validatePhone = (phone) => {
        if (!phone) return "Phone number is required";
        if (!/^\d{10}$/.test(phone)) return "Phone number must be 10 digits";
        return "";
    };

    // State for field-specific errors
    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        phone: ""
    });

    // Handle field blur for validation
    const handleFieldBlur = (field, value) => {
        let errorMessage = "";
        switch (field) {
            case "name":
                errorMessage = validateName(value);
                break;
            case "street":
                errorMessage = validateStreet(value);
                break;
            case "city":
                errorMessage = validateCity(value);
                break;
            case "state":
                errorMessage = validateState(value);
                break;
            case "pincode":
                errorMessage = validatePincode(value);
                break;
            case "phone":
                errorMessage = validatePhone(value);
                break;
            default:
                break;
        }
        setFieldErrors(prev => ({ ...prev, [field]: errorMessage }));
    };

    // Process checkout
    const handleCheckout = async (e) => {
        e.preventDefault();
        setError(null);

        // Check if cart is empty first
        if (cartProducts.length === 0) {
            setError("Your cart is empty");
            toast.error("Your cart is empty");
            return;
        }

        // Validate all fields
        const newFieldErrors = {
            name: validateName(address.name),
            street: validateStreet(address.street),
            city: validateCity(address.city),
            state: validateState(address.state),
            pincode: validatePincode(address.pincode),
            phone: validatePhone(address.phone)
        };

        setFieldErrors(newFieldErrors);

        // Check if any validation errors exist
        const hasErrors = Object.values(newFieldErrors).some(error => error !== "");

        if (hasErrors) {
            // Create a more specific error message that tells the user which fields need correction
            const errorFields = Object.entries(newFieldErrors)
                .filter(([_, error]) => error !== "")
                .map(([field, _]) => {
                    // Convert field names to more readable format
                    switch(field) {
                        case "name": return "Full Name";
                        case "street": return "Street Address";
                        case "city": return "City";
                        case "state": return "State";
                        case "pincode": return "Pincode";
                        case "phone": return "Phone Number";
                        default: return field;
                    }
                });
            
            const errorMessage = `Please correct these fields: ${errorFields.join(", ")}`;
            setError(errorMessage);
            toast.error(errorMessage);
            
            // Scroll to the first field with an error
            const firstErrorField = Object.entries(newFieldErrors).find(([_, error]) => error !== "");
            if (firstErrorField) {
                const fieldElement = document.getElementById(firstErrorField[0]);
                if (fieldElement) {
                    fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    fieldElement.focus();
                }
            }
            
            return;
        }

        setOrderProcessing(true);
        setError(null);

        try {
            // Prepare cart items with quantity, size, and color
            const cartItems = cartProducts.map(product => ({
                productId: product._id,
                quantity: productCount[product._id] || 1,
                price: product.price,
                // Add default size and color if not available
                size: product.size || 'M',
                color: product.color || 'Default'
            }));

            // Create order based on payment method
            const endpoint = paymentMethod === 'Online'
                ? `${API}/payment/create-order`
                : `${API}/payment/create-cod-order`;

            const response = await axios.post(endpoint, {
                cartItems,
                shippingAddress: address,
                totalAmount
            }, { withCredentials: true });

            if (paymentMethod === 'Online') {
                // For online payment, initialize Cashfree checkout
                const { order_token, order_id, payment_link } = response.data;
                setOrderId(order_id);
                
                // Extract payment session ID from payment_link if available
                let paymentSessionId = order_token;
                if (payment_link && payment_link.includes('/sessions/checkout/web/')) {
                    paymentSessionId = payment_link.split('/sessions/checkout/web/')[1];
                    
                }
                
                // If payment_link is available, use it directly instead of SDK
                if (payment_link && payment_link.trim() !== '') {
                    const cleanPaymentLink = payment_link.trim().replace(/`/g, '');
                    
                    toast.info('Redirecting to payment gateway...');
                    window.location.href = cleanPaymentLink;
                    return;
                }
                
                // Fallback to SDK integration if no payment_link
                try {
                    const script = document.createElement('script');
                    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
                    script.onload = () => {
                        try {
                            const cashfree = window.Cashfree;
                            if (!cashfree) {
                                throw new Error('Cashfree SDK not loaded properly');
                            }
                            
                            
                            
                            cashfree.initializeApp({
                                mode: 'sandbox' // Change to 'production' for live environment
                            });

                            

                    // Configure checkout with improved options
                    const checkoutOptions = {
                        paymentSessionId: paymentSessionId, // Use the extracted payment session ID
                        redirectTarget: '_self',
                        onSuccess: (data) => {
                            // Handle success with payment data
                            
                            toast.success('Payment successful! Verifying order...');
                            verifyPayment(order_id);
                        },
                        onFailure: (data) => {
                            // Handle failure with detailed error
                            
                            const errorMessage = data?.error?.message || 'Payment failed. Please try again.';
                            setError(errorMessage);
                            toast.error(errorMessage);
                            setOrderProcessing(false);
                        },
                        onCancel: (data) => {
                            // Handle cancellation with reason if available
                            
                            const cancelMessage = 'Payment was cancelled. Please try again when you\'re ready.';
                            setError(cancelMessage);
                            toast.error(cancelMessage);
                            setOrderProcessing(false);
                        },
                        components: {
                            // Customize payment components display
                            order: {
                                show: true,
                            },
                            card: {
                                show: true,
                                banner: true
                            },
                            upi: {
                                show: true,
                                priority: 1 // Show UPI as first option
                            },
                            netbanking: {
                                show: true,
                                priority: 2
                            },
                            app: {
                                show: true,
                                priority: 3
                            },
                            paylater: {
                                show: true,
                                priority: 4
                            }
                        },
                        theme: {
                            // Customize theme colors to match your site
                            color: '#0d6efd', // Primary color matching Bootstrap primary
                            errorColor: '#dc3545', // Error color matching Bootstrap danger
                            fontSize: '16px'
                        }
                    };

                    

                    // Render checkout with error handling
                    try {
                        
                        cashfree.checkout(checkoutOptions);
                        
                    } catch (checkoutError) {
                            
                            const errorMessage = 'Payment gateway error: ' + (checkoutError.message || 'Unknown error');
                            setError(errorMessage);
                            toast.error('Payment gateway error. Please try again.');
                            setOrderProcessing(false);
                        }
                    } catch (initError) {
                        
                        const errorMessage = 'Failed to initialize payment gateway. Please try again.';
                        setError(errorMessage);
                        toast.error(errorMessage);
                        setOrderProcessing(false);
                    }
                };
                
                script.onerror = () => {
                    
                    const errorMessage = 'Failed to load payment gateway. Please check your internet connection and try again.';
                    setError(errorMessage);
                    toast.error(errorMessage);
                    setOrderProcessing(false);
                };
                
                document.head.appendChild(script);
            } catch (scriptError) {
                
                const errorMessage = 'Failed to set up payment process. Please try again later.';
                setError(errorMessage);
                toast.error(errorMessage);
                setOrderProcessing(false);
            }
            } else {
                // For COD, show success message
                setOrderSuccess(true);
                setOrderId(response.data.order_id);
                setOrderProcessing(false);
                // Clear cart counts from localStorage
                localStorage.removeItem('cartCounts');
                // Clear cart in database
                try {
                    await axios.delete(`${API}/product/cart/clear`, { withCredentials: true });
                    
                } catch (clearCartError) {
                    
                }
                // Update cart in Redux store
                dispatch(GetCartProduct());
            }
        } catch (error) {
            
            
            // Extract detailed error message
            let errorMessage = 'Failed to process order. Please try again.';
            
            if (error.response) {
                // Server responded with an error
                errorMessage = error.response.data?.message || 
                              (error.response.data?.error?.description) || 
                              `Server error: ${error.response.status}`;
                              
                // Log detailed error information for debugging
                
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'No response from server. Please check your internet connection.';
            } else {
                // Error in setting up the request
                errorMessage = error.message || 'Unknown error occurred';
            }
            
            setError(errorMessage);
            toast.error(errorMessage);
            setOrderProcessing(false);
        }
    };

    // Verify payment status with improved error handling and user feedback
    const verifyPayment = async (orderId, retryCount = 0) => {
        try {
            // Show verification in progress message
            if (retryCount === 0) {
                toast.info('Verifying payment status...');
            } else {
                toast.info(`Retrying payment verification (attempt ${retryCount + 1})...`);
            }
            
            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            
            try {
                const response = await axios.get(`${API}/payment/verify/${orderId}`, {
                    withCredentials: true,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId); // Clear timeout on successful response
                
                // Check if response has valid data
                if (!response.data) {
                    throw new Error('Invalid response from payment verification');
                }

                // Check payment status
                if (response.data.order_status === 'PAID') {
                    // Payment successful
                    setOrderSuccess(true);
                    setOrderId(orderId);
                    // Clear cart counts from localStorage
                    localStorage.removeItem('cartCounts');
                    // Clear cart in database
                    try {
                        await axios.delete(`${API}/product/cart/clear`, { withCredentials: true });
                        
                    } catch (clearCartError) {
                        
                    }
                    // Update cart in Redux store
                    dispatch(GetCartProduct());
                    // Show success message
                    toast.success('Payment successful! Your order has been placed.');
                } else if (response.data.order_status === 'ACTIVE' || response.data.order_status === 'PENDING') {
                    // Payment is still being processed
                    setError('Your payment is being processed. Please wait a moment...');
                    toast.info('Payment is being processed. Please wait...');
                    // Try again after 3 seconds, but limit retries
                    if (!window.verifyRetryCount) {
                        window.verifyRetryCount = 1;
                    } else {
                        window.verifyRetryCount++;
                    }
                    
                    if (window.verifyRetryCount <= 5) { // Max 5 retries (15 seconds)
                        setTimeout(() => verifyPayment(orderId), 3000);
                        return; // Don't set orderProcessing to false yet
                    } else {
                        // Too many retries - start periodic checking
                        setError('Payment verification is taking longer than expected. Starting periodic checks...');
                        toast.warning('Payment verification is taking longer than expected. Starting periodic checks...');
                        window.verifyRetryCount = 0; // Reset counter
                        
                        // Start periodic checking every 10 seconds for up to 2 minutes
                        startPeriodicPaymentCheck(orderId);
                        return;
                    }
                } else {
                    // Payment failed
                    setError(`Payment verification failed: ${response.data.order_status}. Please contact support.`);
                    toast.error('Payment verification failed. Please try again or contact support.');
                }
            } catch (requestError) {
                clearTimeout(timeoutId); // Clear timeout on error
                throw requestError; // Re-throw to be caught by outer catch
            }
            
            setOrderProcessing(false);
        } catch (error) {
            
            
            // Implement retry logic with exponential backoff
            if (retryCount < 3 && (error.response?.status >= 500 || error.request)) {
                const delay = Math.pow(2, retryCount) * 2000; // 2s, 4s, 8s
                
                
                setTimeout(() => {
                    verifyPayment(orderId, retryCount + 1);
                }, delay);
                return;
            }
            
            let errorMessage = 'Failed to verify payment status.';
            
            if (error.name === 'AbortError') {
                errorMessage = 'Payment verification timed out. Please check your order status in your account.';
            } else if (error.response) {
                errorMessage = error.response.data?.message || 
                             `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your internet connection.';
            } else {
                errorMessage = error.message || 'Unknown error occurred';
            }
            
            setError(errorMessage);
            toast.error(errorMessage);
            setOrderProcessing(false);
            
            // Reset retry counter on error
            window.verifyRetryCount = 0;
        }
    };

    // Start periodic payment status checking
    const startPeriodicPaymentCheck = (orderId) => {
        let checkCount = 0;
        const maxChecks = 12; // Check for 2 minutes (12 * 10 seconds)
        let isActive = true; // Flag to control if checking should continue
        
        // Store the interval ID for cleanup
        const intervalId = setInterval(() => {
            if (!isActive) {
                clearInterval(intervalId);
                return;
            }
            
            checkCount++;
            
            
            // Check payment status
            axios.get(`${API}/payment/verify/${orderId}`, {
                withCredentials: true
            }).then(response => {
                if (response.data && response.data.order_status === 'PAID') {
                    // Payment successful
                    isActive = false;
                    clearInterval(intervalId);
                    
                    setOrderSuccess(true);
                    setOrderId(orderId);
                    setOrderProcessing(false);
                    setError(null);
                    
                    // Clear cart
                    localStorage.removeItem('cartCounts');
                    try {
                        axios.delete(`${API}/product/cart/clear`, { withCredentials: true });
                    } catch (clearCartError) {
                        
                    }
                    dispatch(GetCartProduct());
                    
                    toast.success('Payment successful! Your order has been placed.');
                    return;
                }
                
                if (checkCount >= maxChecks) {
                    // Stop checking after max attempts
                    isActive = false;
                    clearInterval(intervalId);
                    
                    setError('Payment verification is taking longer than expected. Please check your order status in your account.');
                    toast.warning('Payment verification is taking longer than expected. Please check your order status in your account.');
                    setOrderProcessing(false);
                    return;
                }
            }).catch(error => {
                
                
                if (checkCount >= maxChecks) {
                    isActive = false;
                    clearInterval(intervalId);
                    
                    setError('Failed to verify payment status. Please check your order status in your account.');
                    toast.error('Failed to verify payment status. Please check your order status in your account.');
                    setOrderProcessing(false);
                    return;
                }
            });
        }, 10000); // Check every 10 seconds
        
        // Return cleanup function
        return () => {
            isActive = false;
            clearInterval(intervalId);
        };
    };

    // Cleanup function for periodic checking
    useEffect(() => {
        let cleanupFunction = null;
        
        // If there's a pending payment, start periodic checking
        const urlParams = new URLSearchParams(window.location.search);
        const pendingOrderId = urlParams.get('order_id');
        
        if (pendingOrderId && isAuthenticated) {
            cleanupFunction = startPeriodicPaymentCheck(pendingOrderId);
        }
        
        // Cleanup on unmount
        return () => {
            if (cleanupFunction) {
                cleanupFunction();
            }
        };
    }, [isAuthenticated]);

    // Handle order success
    const handleContinueShopping = () => {
        navigate('/');
    };

    // Handle view order details
    const handleViewOrder = () => {
        navigate('/orders');
    };

    if (loading) {
        return (
            <div className="container mt-5 pt-5 text-center">
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                    <p className="mt-4 text-muted">Loading checkout information...</p>
                </div>
                        </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="container mt-5 pt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card border-0 shadow">
                            <div className="card-body text-center p-5">
                                <div className="success-animation mb-4">
                                    <div className="checkmark-circle">
                                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                                    </div>
                                </div>
                                <h2 className="mb-4 fw-bold">Payment Successful!</h2>
                                <h3 className="mb-4">Your order has been placed successfully</h3>
                                <div className="order-info p-3 mb-4 bg-light rounded">
                                    <p className="mb-1">Order ID: <strong className="text-primary">{orderId}</strong></p>
                                    <p className="mb-0 text-muted"><i className="bi bi-clock me-2"></i>Estimated delivery: 3-5 business days</p>
                                </div>
                                <p className="mb-4">Thank you for shopping with Repcore Gym. We will process your order soon.</p>
                                <p className="small text-muted mb-4">A confirmation email has been sent to your registered email address.</p>
                                <div className="d-flex justify-content-center gap-3">
                                    <button className="btn btn-outline-primary px-4" onClick={handleViewOrder}>
                                        <i className="bi bi-eye me-2"></i>View Order
                                    </button>
                                    <button className="btn btn-primary px-4" onClick={handleContinueShopping}>
                                        <i className="bi bi-cart me-2"></i>Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5">
            <div className="checkout-header mb-4">
                <h2 className="text-center fw-bold">Secure Checkout</h2>
                <div className="text-center mb-4">
                    <span className="badge bg-light text-dark me-2 p-2">
                        <i className="bi bi-shield-lock me-1"></i> Secure Payment
                    </span>
                    <span className="badge bg-light text-dark me-2 p-2">
                        <i className="bi bi-truck me-1"></i> Fast Delivery
                    </span>
                    <span className="badge bg-light text-dark p-2">
                        <i className="bi bi-arrow-return-left me-1"></i> Easy Returns
                    </span>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                </div>
            )}

            <div className="row g-4">
                {/* Shipping Address Form */}
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white border-bottom border-light">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-geo-alt text-primary me-2"></i>
                                <h5 className="mb-0 fw-bold">Shipping Address</h5>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleCheckout}>
                                {savedAddresses.length > 0 && (
                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Saved Addresses</label>
                                        <div className="saved-addresses">
                                            {savedAddresses.map(addr => (
                                                <div
                                                    key={addr._id}
                                                    className={`address-card p-3 mb-2 border rounded ${selectedAddressId === addr._id ? 'border-primary' : ''}`}
                                                    onClick={() => handleSelectAddress(addr._id)}
                                                >
                                                    <div className="d-flex justify-content-between">
                                                        <div className="form-check">
                                                            <input
                                                                type="radio"
                                                                className="form-check-input"
                                                                checked={selectedAddressId === addr._id}
                                                                onChange={() => handleSelectAddress(addr._id)}
                                                                id={`address-${addr._id}`}
                                                            />
                                                            <label className="form-check-label fw-bold" htmlFor={`address-${addr._id}`}>
                                                                {addr.name} {addr.isDefault && <span className="badge bg-info ms-2">Default</span>}
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger me-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteAddress(addr._id);
                                                                }}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                            {!addr.isDefault && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSetDefaultAddress(addr._id);
                                                                    }}
                                                                >
                                                                    Set Default
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-muted">
                                                        <p className="mb-1">{addr.street}, {addr.city}</p>
                                                        <p className="mb-1">{addr.state}, {addr.pincode}</p>
                                                        <p className="mb-0">Phone: {addr.phone}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary mt-2"
                                            onClick={() => toggleAddressForm()}
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Add New Address
                                        </button>
                                    </div>
                                )}

                                {(showAddressForm || savedAddresses.length === 0) && (
                                    <div className="address-form">
                                        <h5 className="mb-3">{savedAddresses.length === 0 ? 'Add Shipping Address' : 'Add New Address'}</h5>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Full Name <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                                                id="name"
                                                name="name"
                                                value={address.name}
                                                onChange={handleAddressChange}
                                                onBlur={(e) => handleFieldBlur('name', e.target.value)}
                                                required
                                            />
                                            {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                                        </div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="street" className="form-label text-dark">Street Address <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className={`form-control ${fieldErrors.street ? 'is-invalid' : ''}`}
                                        id="street"
                                        name="street"
                                        value={address.street}
                                        onChange={handleAddressChange}
                                        onBlur={(e) => handleFieldBlur('street', e.target.value)}
                                        required
                                    />
                                    {fieldErrors.street && <div className="invalid-feedback">{fieldErrors.street}</div>}
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="city" className="form-label text-dark">City <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${fieldErrors.city ? 'is-invalid' : ''}`}
                                            id="city"
                                            name="city"
                                            value={address.city}
                                            onChange={handleAddressChange}
                                            onBlur={(e) => handleFieldBlur('city', e.target.value)}
                                            required
                                        />
                                        {fieldErrors.city && <div className="invalid-feedback">{fieldErrors.city}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="state" className="form-label text-dark">State <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${fieldErrors.state ? 'is-invalid' : ''}`}
                                            id="state"
                                            name="state"
                                            value={address.state}
                                            onChange={handleAddressChange}
                                            onBlur={(e) => handleFieldBlur('state', e.target.value)}
                                            required
                                        />
                                        {fieldErrors.state && <div className="invalid-feedback">{fieldErrors.state}</div>}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="pincode" className="form-label text-dark">Pincode <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${fieldErrors.pincode ? 'is-invalid' : ''}`}
                                            id="pincode"
                                            name="pincode"
                                            value={address.pincode}
                                            onChange={handleAddressChange}
                                            onBlur={(e) => handleFieldBlur('pincode', e.target.value)}
                                            required
                                            maxLength="6"
                                            pattern="\d{6}"
                                            placeholder="6-digit pincode"
                                        />
                                        {fieldErrors.pincode && <div className="invalid-feedback">{fieldErrors.pincode}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label text-dark">Phone Number <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <span className="input-group-text">+91</span>
                                            <input
                                                type="tel"
                                                className={`form-control ${fieldErrors.phone ? 'is-invalid' : ''}`}
                                                id="phone"
                                                name="phone"
                                                value={address.phone}
                                                onChange={handleAddressChange}
                                                onBlur={(e) => handleFieldBlur('phone', e.target.value)}
                                                required
                                                maxLength="10"
                                                pattern="\d{10}"
                                                placeholder="10-digit number"
                                            />
                                            {fieldErrors.phone && <div className="invalid-feedback">{fieldErrors.phone}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="country" className="form-label text-dark">Country</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="country"
                                        name="country"
                                        value={address.country}
                                        onChange={handleAddressChange}
                                        readOnly
                                    />
                                    <small className="text-muted">Currently, we only ship within India</small>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold d-block text-dark">Payment Method</label>
                                    <div className="payment-options mt-2">
                                        <div className="form-check custom-radio mb-2 p-3 border rounded"
                                            style={{
                                                backgroundColor: paymentMethod === 'Online' ? '#f8f9fa' : 'transparent',
                                                borderColor: paymentMethod === 'Online' ? '#0d6efd' : '#dee2e6'
                                            }}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="paymentMethod"
                                                id="online"
                                                value="Online"
                                                checked={paymentMethod === 'Online'}
                                                onChange={handlePaymentMethodChange}
                                            />
                                            <label className="form-check-label w-100" htmlFor="online">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <span className="fw-bold">Online Payment</span>
                                                        <p className="text-muted mb-0 small">Pay securely with Credit/Debit Card, UPI, Net Banking</p>
                                                    </div>
                                                    <div>
                                                        <i className="bi bi-credit-card text-primary fs-4"></i>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="form-check custom-radio p-3 border rounded"
                                            style={{
                                                backgroundColor: paymentMethod === 'COD' ? '#f8f9fa' : 'transparent',
                                                borderColor: paymentMethod === 'COD' ? '#0d6efd' : '#dee2e6'
                                            }}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="paymentMethod"
                                                id="cod"
                                                value="COD"
                                                checked={paymentMethod === 'COD'}
                                                onChange={handlePaymentMethodChange}
                                            />
                                            <label className="form-check-label w-100" htmlFor="cod">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <span className="fw-bold">Cash on Delivery</span>
                                                        <p className="text-muted mb-0 small">Pay when you receive your order</p>
                                                    </div>
                                                    <div>
                                                        <i className="bi bi-cash text-success fs-4"></i>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {showAddressForm && savedAddresses.length > 0 && (
                                    <div className="d-flex mb-4">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary me-2"
                                            onClick={() => toggleAddressForm()}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={handleSaveAddress}
                                        >
                                            Save Address
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-3 fw-bold"
                                    disabled={orderProcessing || cartProducts.length === 0 || (savedAddresses.length === 0 && showAddressForm)}
                                >
                                    {orderProcessing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Processing Payment...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-lock-fill me-2"></i>
                                            {paymentMethod === 'Online' ? 'Pay Now' : 'Place Order'} - ₹{totalAmount.toFixed(2)}
                                        </>
                                    )}
                                </button>

                                <div className="mt-3 text-center">
                                    <small className="text-muted">
                                        <i className="bi bi-shield-lock me-1"></i>
                                        Your payment information is secure and encrypted
                                    </small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom border-light">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-cart-check text-primary me-2"></i>
                                <h5 className="mb-0 fw-bold">Order Summary</h5>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            {cartProducts.length === 0 ? (
                                <div className="text-center py-4">
                                    <i className="bi bi-cart-x text-muted" style={{ fontSize: '3rem' }}></i>
                                    <p className="mt-3 mb-0">Your cart is empty</p>
                                    <button
                                        className="btn btn-outline-primary mt-3"
                                        onClick={() => navigate('/products')}
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {loading ? (
                                        <div className="text-center py-3">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-2">Loading your cart...</p>
                                        </div>
                                    ) : cartProducts.length > 0 ? cartProducts.map(product => (
                                        <div className="d-flex mb-3 p-2 border-bottom" key={product._id}>
                                            <div className="flex-shrink-0" style={{ width: '70px', height: '70px' }}>
                                                <img
                                                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.jpg'}
                                                    alt={product.name}
                                                    className="img-fluid rounded"
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/70x70?text=Product';
                                                    }}
                                                />
                                            </div>
                                            <div className="ms-3 flex-grow-1">
                                                <h6 className="mb-1 product-name">{product.name}</h6>
                                                <div className="product-details">
                                                    {product.size && <span className="badge bg-light text-dark me-2">Size: {product.size}</span>}
                                                    {product.color && <span className="badge bg-light text-dark">Color: {product.color}</span>}
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mt-2">
                                                    <div className="d-flex align-items-center">
                                                        <span className="text-muted me-2">Qty:</span>
                                                        <span className="fw-bold">{productCount[product._id] || 1}</span>
                                                    </div>
                                                    <span className="fw-bold">₹{(product.price * (productCount[product._id] || 1)).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-4">
                                            <i className="bi bi-cart-x text-muted" style={{ fontSize: '3rem' }}></i>
                                            <p className="mt-3 mb-0">No products in your cart</p>
                                            <button
                                                className="btn btn-outline-primary mt-3"
                                                onClick={() => navigate('/products')}
                                            >
                                                Browse Products
                                            </button>
                                        </div>
                                    )}
                                    <div className="price-details mt-3 p-3 bg-light rounded">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Subtotal</span>
                                            <span>₹{totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Shipping</span>
                                            <span className="text-success">Free</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Tax</span>
                                            <span>Included</span>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between fw-bold">
                                            <span>Total</span>
                                            <span className="text-primary fs-5">₹{totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="fw-bold">Accepted Payment Methods</span>
                                        </div>
                                        <div className="payment-icons d-flex flex-wrap gap-2 mb-3">
                                            <i className="bi bi-credit-card fs-4 text-muted"></i>
                                            <i className="bi bi-wallet2 fs-4 text-muted"></i>
                                            <i className="bi bi-bank fs-4 text-muted"></i>
                                            <i className="bi bi-currency-rupee fs-4 text-muted"></i>
                                        </div>
                                    </div>

                                    <div className="mt-3 border-top pt-3">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-shield-check text-success me-2"></i>
                                            <small>100% Purchase Protection</small>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;