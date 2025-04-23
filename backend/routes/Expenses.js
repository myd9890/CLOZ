const router = require('express').Router();
const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getExpenseById
} = require('../controllers/expenseController');

// Route to add a new expense
router.post("/add", addExpense);

// Route to get all expenses
router.get("/", getExpenses);

// Route to update an expense
router.put("/update/:id", updateExpense);

// Route to delete an expense
router.delete("/delete/:id", deleteExpense);

// Route to get a specific expense by ID
router.get("/get/:id", getExpenseById);

module.exports = router;