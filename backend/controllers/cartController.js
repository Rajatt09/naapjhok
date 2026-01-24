const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = await Cart.create({ user: req.user.id, items: [] });
        }
        res.status(200).json({
            status: 'success',
            cart
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { product, withFabric, profileId, customization } = req.body;
        
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [] });
        }

        const parsedProduct = typeof product === 'string' ? JSON.parse(product) : product;
        const parsedCustomization = typeof customization === 'string' ? JSON.parse(customization) : customization;
        const isWithFabric = withFabric === 'true' || withFabric === true;

        // Handle Image Upload
        let referenceImageUrl = null;
        if (req.file) {
            // Check if cloudinary config exists, else fallback to local
            const cloudinary = require('../config/cloudinary');
            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'naapjhok/reference-images',
                    use_filename: true,
                    unique_filename: true
                });
                referenceImageUrl = result.secure_url;
                
                // Remove local file
                const fs = require('fs');
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

            } catch (uploadErr) {
                console.error('Cloudinary Upload Err:', uploadErr);
                // Fallback to local path if Cloudinary fails (e.g. invalid credentials)
                referenceImageUrl = `/uploads/reference-images/${req.file.filename}`;
            }
        }

        const newItem = {
            product: parsedProduct,
            withFabric: isWithFabric,
            profileId,
            customization: parsedCustomization ? {
                ...parsedCustomization,
                referenceImage: referenceImageUrl || parsedCustomization.referenceImage
            } : null
        };

        cart.items.push(newItem);
        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({
            status: 'success',
            message: 'Item added to cart',
            cart
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const cart = await Cart.findOne({ user: req.user.id });
        
        if (cart) {
            // Efficiently remove item using MongoDB $pull operator atomic update
            cart.items.pull({ _id: itemId });
            await cart.save();
        }

        res.status(200).json({
            status: 'success',
            cart
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
