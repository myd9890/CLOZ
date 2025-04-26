const express = require('express');
const router = express.Router();
const {
    applyDiscountToProduct,
    applyBulkDiscount,
    removeDiscount,
    getDiscountedProducts
} = require('../controllers/discount_controller.js');

// Apply discount to a single product
router.put('/apply/:productId', applyDiscountToProduct);

// Apply discount to multiple products
router.put('/bulk-apply', applyBulkDiscount);

// Remove discount from a product
router.put('/remove/:productId', removeDiscount);

// Get all discounted products
router.get('/discounted', getDiscountedProducts);

module.exports = router;