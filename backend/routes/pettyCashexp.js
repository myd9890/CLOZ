const router = require('express').Router();
const {
    addPettyCash,
    getAllPettyCash,
    updatePettyCash,
    deletePettyCash,
    getPettyCashById
} = require('../controllers/pettyCashController');

// Route to add a new petty cash expense
router.post("/add", addPettyCash);

// Route to get all petty cash expenses
router.get("/", getAllPettyCash);

// Route to update a petty cash expense
router.put("/update/:id", updatePettyCash);

// Route to delete a petty cash expense
router.delete("/delete/:id", deletePettyCash);

// Route to get a specific petty cash expense by ID
router.get("/get/:id", getPettyCashById);

module.exports = router;