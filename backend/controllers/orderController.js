const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        // User from Auth Middleware
        if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

        const { items, totalAmount, appointment, profileId } = req.body;

        const newOrder = await Order.create({
            user: req.user.id,
            profileId,
            items: items.map(item => ({
                product: item.product, 
                quantity: item.quantity,
                withFabric: item.withFabric,
                price: item.price,
                customization: item.customization
            })),
            totalAmount,
            appointment,
            status: 'Pending'
        });

        // Robust Cart Cleanup: Remove ordered items from User's Cart
        // We assume req.body.items includes the original 'product' ID. 
        // However, to remove from Cart.items, we need to match the specific array element or product.
        // A better approach for "production": passing matched Cartesian Item IDs to backend.
        // But for now, let's remove by Product ID + Profile ID match in the Cart.
        
        const Cart = require('../models/Cart');
        const cart = await Cart.findOne({ user: req.user.id });
        
        if (cart) {
            // Filter out items that were just ordered
            // We match by product ID and profile ID (and arguably 'withFabric' to be precise)
            // Or simpler: The frontend could send 'cartItemIds' to be purely explicit.
            // Let's iterate and remove.
            
            const orderedProductIds = items.map(i => i.product.toString());
            
            cart.items = cart.items.filter(cartItem => {
                // Keep item if it's NOT in the ordered matching set
                // Matching criteria: product ID matching AND profile ID matching
                const isOrdered = orderedProductIds.includes(cartItem.product.id ? cartItem.product.id.toString() : cartItem.product.toString()) 
                                  && (cartItem.profileId === profileId);
                return !isOrdered;
            });
            
            await cart.save();
        }

        res.status(201).json({
            status: 'success',
            data: { order: newOrder }
        });
    } catch (err) {
        console.error("Create Order Error:", err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: { orders }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort('-createdAt');
        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: { orders }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
