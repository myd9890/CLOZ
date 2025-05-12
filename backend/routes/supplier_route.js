const express = require('express');
const router = express.Router();
const supplier = require('../controllers/supplier_controller');
/* const { loginSupplier, logoutSupplier } = require('../controllers/supplier_controller'); */


// Route to add a new supplier
router.post('/add', supplier.addSupplier);

router.get('/', supplier.getSuppliers);

router.get('/:supplierObjectId', supplier.get);

router.get('/supplierprofile/:supplierId', supplier.getSupplier);

router.put('/update/:id', supplier.updateSupplier);

router.delete('/delete/:id', supplier.deleteSupplier);

/* // Login route
router.post('/login', loginSupplier);

// Logout route
router.post('/logout', logoutSupplier); */

module.exports = router;
