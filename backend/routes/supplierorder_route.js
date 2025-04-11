const express = require('express');
const supplierOrder = require('../controllers/supplierOrder_controller');
const router = express.Router();

router.get('/supplier/:supplierId', supplierOrder.getOrdersForSupplier); 
router.put('/update/:orderId', supplierOrder.updateOrderStatus); 
router.get('/allorders',supplierOrder.getAllOrders);
router.put('/updateadminstatus/:id',supplierOrder.updateAdminStatus);
router.post('/place',supplierOrder.placeManualOrder);
module.exports = router;