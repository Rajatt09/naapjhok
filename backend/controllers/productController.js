const productService = require('../services/productService');
const { sendSuccess } = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');
const STATUS = require('../constants/statusCodes');

exports.getAllProducts = asyncHandler(async (req, res) => {
	const queryObj = { ...req.query };
	const products = await productService.getAllProducts(queryObj);
	const formatted = products.map((p) => productService.formatProductForResponse(req, p));

	return sendSuccess(res, STATUS.OK, { products: formatted }, null, null, products.length);
});

exports.getProduct = asyncHandler(async (req, res) => {
	const product = await productService.getProductById(req.params.id);
	const formatted = productService.formatProductForResponse(req, product);

	return sendSuccess(res, STATUS.OK, { product: formatted });
});

exports.createProduct = asyncHandler(async (req, res) => {
	const imagePath = req.file ? `uploads/reference-images/${req.file.filename}` : null;
	const productData = {
		name: req.body.name,
		description: req.body.description,
		category: req.body.category,
		gender: req.body.gender,
		basePrice: req.body.basePrice,
		fabricPrice: req.body.fabricPrice,
	};

	const newProduct = await productService.createProduct(productData, imagePath);
	const formatted = productService.formatProductForResponse(req, newProduct);

	return sendSuccess(res, STATUS.CREATED, { product: formatted });
});

exports.updateProduct = asyncHandler(async (req, res) => {
	const imagePath = req.file ? `uploads/reference-images/${req.file.filename}` : null;
	const updateData = {
		name: req.body.name,
		description: req.body.description,
		category: req.body.category,
		gender: req.body.gender,
		basePrice: req.body.basePrice,
		fabricPrice: req.body.fabricPrice,
	};

	const product = await productService.updateProduct(req.params.id, updateData, imagePath);
	const formatted = productService.formatProductForResponse(req, product);

	return sendSuccess(res, STATUS.OK, { product: formatted });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
	await productService.deleteProduct(req.params.id);
	return sendSuccess(res, STATUS.NO_CONTENT, null);
});
