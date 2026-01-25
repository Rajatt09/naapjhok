const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { restrictToAdmin } = require("../middlewares/adminMiddleware");

// Protect all routes and restrict to admin
router.use(protect);
router.use(restrictToAdmin);

// Dashboard stats
router.get("/stats", adminController.getDashboardStats);

// Users management
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserDetails);
router.delete("/users/:id", adminController.deleteUser);

// Orders management
router.get("/orders", adminController.getAllOrders);

module.exports = router;
