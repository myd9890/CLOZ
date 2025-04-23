const Expense = require('../models/Expense');

// Add a new expense
const addExpense = async (req, res) => {
    const { ID, expense, expenseType, expDate, Amount } = req.body;

    const newExpense = new Expense({
        ID,
        expense,
        expenseType,
        expDate: Date.parse(expDate),
        Amount
    });

    try {
        await newExpense.save();
        res.json("Expense added!");
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with adding expense", error: err.message });
    }
};

// Get all expenses
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with fetching expenses", error: err.message });
    }
};

// Update an expense
const updateExpense = async (req, res) => {
    const expenseID = req.params.id;
    const { ID, expense, expenseType, expDate, Amount } = req.body;

    const updateExpense = {
        ID,
        expense,
        expenseType,
        expDate,
        Amount
    };

    try {
        await Expense.findByIdAndUpdate(expenseID, updateExpense);
        res.status(200).send({ status: "Expense updated!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with updating expense", error: err.message });
    }
};

// Delete an expense
const deleteExpense = async (req, res) => {
    const expenseID = req.params.id;

    try {
        await Expense.findByIdAndDelete(expenseID);
        res.status(200).send({ status: "Expense deleted!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with deleting expense", error: err.message });
    }
};

// Get a specific expense
const getExpenseById = async (req, res) => {
    const expenseID = req.params.id;

    try {
        const expense = await Expense.findById(expenseID);
        res.status(200).send({ status: "Expense fetched!", expense });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with fetching expense", error: err.message });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getExpenseById
};