const router = require('express').Router();
const {
    addLiability,
    getLiabilities,
    updateLiability,
    deleteLiability,
    getLiabilityById,
} = require('../controllers/liabilityController');

// Route to add a new liability
router.post("/add", addLiability);

// Route to get all liabilities
router.get("/", getLiabilities);

// Route to update a liability
router.put("/update/:id", updateLiability);

// Route to delete a liability
router.delete("/delete/:id", deleteLiability);

// Route to get a specific liability by ID
router.get("/get/:id", getLiabilityById);

module.exports = router;