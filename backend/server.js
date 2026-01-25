const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import utilities
const globalErrorHandler = require('./utils/errorHandler');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:5173',
		credentials: true,
	}),
);

const PORT = process.env.PORT || 5000;

// Health check route
app.get('/', (req, res) => {
	res.json({ message: 'Naapjhok Backend Running', status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

// Serve Uploads
app.use('/uploads', express.static('uploads'));

// Global Error Handler (must be last)
app.use(globalErrorHandler);

// Database Connection
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log('✅ MongoDB Connected');
	})
	.catch((err) => {
		console.error('❌ MongoDB Connection Error:', err);
		process.exit(1);
	});

// Start Server
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
	console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
