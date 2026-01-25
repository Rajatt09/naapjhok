const express = require('express');
const orderController = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes for orders
router.use(protect);

router.route('/')
    .post(orderController.createOrder)
    .get(orderController.getMyOrders);

module.exports = router;
