const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect); // Protect all routes for orders

router.route('/')
    .post(orderController.createOrder)
    .get(orderController.getMyOrders);

// Admin route placeholder
// router.route('/all').get(authMiddleware.restrictTo('admin'), orderController.getAllOrders);

module.exports = router;
