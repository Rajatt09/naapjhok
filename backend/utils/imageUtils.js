/**
 * Image URL building utilities
 */

const buildImageUrl = (req, imagePath) => {
	if (!imagePath) return null;
	if (imagePath.startsWith('http')) return imagePath;
	return `${req.protocol}://${req.get('host')}/${imagePath}`;
};

const formatProduct = (req, product) => {
	const obj = product.toObject ? product.toObject() : product;
	return {
		...obj,
		referenceImage: buildImageUrl(req, obj.image),
	};
};

module.exports = {
	buildImageUrl,
	formatProduct,
};
