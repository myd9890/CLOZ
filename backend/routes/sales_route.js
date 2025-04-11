const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales_controller');

// Create a new sale
router.post('/add', salesController.createSale);

// Get all sales
router.get('/', salesController.getSales);

// Get sale by ID
router.get('/get/:id', salesController.getSale);

// Update sale
router.patch('update/:id', salesController.updateSale);

// Delete sale
router.delete('delete/:id', salesController.deleteSale);

// Get sales statistics
//router.get('/stats/summary', salesController.getSalesStats);

module.exports = router;