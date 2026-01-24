const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(protect);

router.get('/', cartController.getCart);
router.post('/', upload.single('referenceImage'), cartController.addToCart);
router.delete('/:itemId', cartController.removeFromCart);

module.exports = router;
