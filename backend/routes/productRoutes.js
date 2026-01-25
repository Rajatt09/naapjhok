const express = require("express");
const productController = require("../controllers/productController");
const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");
const { restrictToAdmin } = require("../middlewares/adminMiddleware");

const router = express.Router();

// Public routes
router.route("/").get(productController.getAllProducts);
router.route("/:id").get(productController.getProduct);

// Protected admin routes
router.use(protect);
router.use(restrictToAdmin);

router
	.route("/")
	.post(upload.single("referenceImage"), productController.createProduct);

router
	.route("/:id")
	.put(upload.single("referenceImage"), productController.updateProduct)
	.delete(productController.deleteProduct);

module.exports = router;
