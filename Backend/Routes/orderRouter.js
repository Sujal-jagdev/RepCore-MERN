const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/Order');
const isLoggedin = require('../Middlewares/isLoggedin');
const isOwner = require('../Middlewares/isOwner');

// User routes
router.post('/create', isLoggedin, orderController.createOrder);
router.get('/user', isLoggedin, orderController.getUserOrders);
router.get('/:id', isLoggedin, orderController.getOrderById);
router.put('/:id/cancel', isLoggedin, orderController.cancelOrder);

// Admin routes
router.get('/', isLoggedin, isOwner, orderController.getAllOrders);
router.put('/:id/status', isLoggedin, isOwner, orderController.updateOrderStatus);
router.post('/:id/refund', isLoggedin, isOwner, orderController.processRefund);

module.exports = router;