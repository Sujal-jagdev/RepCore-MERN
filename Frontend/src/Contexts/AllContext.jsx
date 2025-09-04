import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const MyContext = createContext();
export const AuthContext = createContext();
export const CartContext = createContext();
export const API = `http://localhost:3000`;

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useCart = () => {
  return useContext(CartContext);
};

const AllContext = ({ children }) => {
  const [product, setproduct] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [localCart, setLocalCart] = useState([]);
  
  // Load local cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('localCartItems');
    if (savedCart) {
      try {
        setLocalCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing local cart:', error);
        localStorage.removeItem('localCartItems');
      }
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set the auth token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user data
          const response = await axios.get(`${API}/user/profile`);
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/user/login`, { email, password }, { withCredentials: true });
      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Update authentication state
      setUser(user);
      setIsAuthenticated(true);
      
      console.log('Login successful, authentication state updated:', { user, isAuthenticated: true });
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      
      if (error.response?.data?.needsVerification) {
        return { 
          success: false, 
          needsVerification: true, 
          userId: error.response.data.userId,
          error: error.response?.data?.message || 'Email not verified' 
        };
      }
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API}/user/register`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  // Save local cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('localCartItems', JSON.stringify(localCart));
  }, [localCart]);

  // Cart functions for non-authenticated users
  const addToLocalCart = (productId) => {
    if (!localCart.includes(productId)) {
      setLocalCart([...localCart, productId]);
      return true;
    }
    return false;
  };

  const removeFromLocalCart = (productId) => {
    setLocalCart(localCart.filter(id => id !== productId));
  };

  const clearLocalCart = () => {
    setLocalCart([]);
    localStorage.removeItem('localCartItems');
  };

  const cartContextValue = {
    localCart,
    addToLocalCart,
    removeFromLocalCart,
    clearLocalCart
  };

  const authContextValue = {
    user,
    setUser,
    isAuthenticated,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <CartContext.Provider value={cartContextValue}>
        <MyContext.Provider value={{ product, setproduct }}>
          {children}
        </MyContext.Provider>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

export default AllContext
