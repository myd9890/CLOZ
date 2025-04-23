const router = require('express').Router();
const {
    addIncome,
    getAllIncomes,
    updateIncome,
    deleteIncome,
    getIncomeById
} = require('../controllers/incomeController');

router.post("/add", addIncome);
router.get("/", getAllIncomes);
router.put("/update/:id", updateIncome);
router.delete("/delete/:id", deleteIncome);
router.get("/get/:id", getIncomeById);

module.exports = router;