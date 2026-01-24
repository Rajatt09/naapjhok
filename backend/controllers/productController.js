const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        const products = await Product.find(queryObj);

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: {
                products
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }
        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { product: newProduct }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
