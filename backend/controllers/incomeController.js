const Income = require('../models/Income');

const addIncome = async (req, res) => {
    const { ID, IncomeName, IncomeDate, Amount } = req.body;

    const newIncome = new Income({
        ID,
        IncomeName,
        IncomeDate: Date.parse(IncomeDate),
        Amount
    });

    try {
        await newIncome.save();
        res.json("Income added!");
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send({ status: "Duplicate ID error", error: "Income ID already exists." });
        }
        console.log(err);
        res.status(500).send({ status: "Error with adding income", error: err.message });
    }
};


const getAllIncomes = async (req, res) => {
    try {
        const incomes = await Income.find();
        res.json(incomes);
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with fetching incomes", error: err.message });
    }
};

const updateIncome = async (req, res) => {
    const incomeID = req.params.id;
    const { ID, IncomeName, IncomeDate, Amount } = req.body;

    const updateIncome = {
        ID,
        IncomeName,
        IncomeDate,
        Amount
    };

    try {
        await Income.findByIdAndUpdate(incomeID, updateIncome);
        res.status(200).send({ status: "Income updated!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with updating income", error: err.message });
    }
};

const deleteIncome = async (req, res) => {
    const incomeID = req.params.id;

    try {
        await Income.findByIdAndDelete(incomeID);
        res.status(200).send({ status: "Income deleted!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with deleting income", error: err.message });
    }
};

const getIncomeById = async (req, res) => {
    const incomeID = req.params.id;

    try {
        const income = await Income.findById(incomeID);
        res.status(200).send({ status: "Income fetched!", income });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with fetching income", error: err.message });
    }
};

module.exports = {
    addIncome,
    getAllIncomes,
    updateIncome,
    deleteIncome,
    getIncomeById
};