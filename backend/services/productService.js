/**
 * Product service - Business logic for products
 */

const Product = require('../models/Product');
const { formatProduct } = require('../utils/imageUtils');
const STATUS = require('../constants/statusCodes');

class ProductService {
	async getAllProducts(queryObj) {
		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach((el) => delete queryObj[el]);

		const products = await Product.find(queryObj);
		return products;
	}

	async getProductById(productId) {
		const product = await Product.findById(productId);
		if (!product) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'Product not found' };
		}
		return product;
	}

	async createProduct(productData, imagePath) {
		const newProduct = await Product.create({
			...productData,
			image: imagePath,
		});
		return newProduct;
	}

	async updateProduct(productId, updateData, imagePath) {
		const product = await Product.findById(productId);
		if (!product) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'Product not found' };
		}

		const fields = ['name', 'description', 'category', 'gender', 'basePrice', 'fabricPrice'];
		fields.forEach((field) => {
			if (updateData[field] !== undefined) {
				product[field] = updateData[field];
			}
		});

		if (imagePath) {
			product.image = imagePath;
		}

		await product.save();
		return product;
	}

	async deleteProduct(productId) {
		const product = await Product.findByIdAndDelete(productId);
		if (!product) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'Product not found' };
		}
		return product;
	}

	formatProductForResponse(req, product) {
		return formatProduct(req, product);
	}
}

module.exports = new ProductService();
