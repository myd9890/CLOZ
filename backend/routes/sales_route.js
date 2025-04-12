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

router.get('/return/:id', salesController.initiateReturn);

router.post('/return/:id', salesController.processReturn);

// Get sales statistics
//router.get('/stats/summary', salesController.getSalesStats);

module.exports = router;