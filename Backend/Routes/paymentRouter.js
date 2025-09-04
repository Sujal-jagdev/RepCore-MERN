const express = require('express');
const paymentRouter = express.Router();
const isLoggedIn = require('../Middlewares/isLoggedin');
const isOwner = require('../Middlewares/isOwner');
const {
    createPaymentOrder,
    verifyPayment,
    handleWebhook,
    getUserOrders,
    getOrderById,
    createCODOrder,
    cancelOrder
} = require('../Controllers/Payment');

// Payment routes
paymentRouter.post('/create-order', isLoggedIn, createPaymentOrder);
paymentRouter.post('/create-cod-order', isLoggedIn, createCODOrder);
// Allow verification without auth, since gateway return may not have cookies yet
paymentRouter.get('/verify/:order_id', verifyPayment);
paymentRouter.post('/webhook', handleWebhook); // No auth for webhooks

// Order management routes
paymentRouter.get('/orders', isLoggedIn, getUserOrders);
paymentRouter.get('/orders/:orderId', isLoggedIn, getOrderById);
paymentRouter.put('/orders/:orderId/cancel', isLoggedIn, cancelOrder);

module.exports = paymentRouter;