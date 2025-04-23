const Petty = require('../models/pettyCash');

// Add a new petty cash expense
const addPettyCash = async (req, res) => {
    const { ID, expense, Type, expDate, Amount } = req.body;

    const newPetty = new Petty({
        ID,
        expense,
        Type,
        expDate: Date.parse(expDate),
        Amount
    });

    try {
        await newPetty.save();
        res.json("Petty cash expense added!");
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with adding data!", error: err.message });
    }
};

// Get all petty cash expenses
const getAllPettyCash = async (req, res) => {
    try {
        const petty = await Petty.find();
        res.json(petty);
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with fetching data!", error: err.message });
    }
};

// Update a petty cash expense
const updatePettyCash = async (req, res) => {
    const pettycashID = req.params.id;
    const { ID, expense, Type, expDate, Amount } = req.body;

    const updatePetty = {
        ID,
        expense,
        Type,
        expDate: Date.parse(expDate), // Ensure expDate is parsed correctly
        Amount
    };

    try {
        const updatedPetty = await Petty.findByIdAndUpdate(pettycashID, updatePetty, { new: true });
        if (!updatedPetty) {
            return res.status(404).send({ status: "Petty cash expense not found!" });
        }
        res.status(200).send({ status: "Petty cash expense updated!", updatedPetty });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with updating data!", error: err.message });
    }
};

// Delete a petty cash expense
const deletePettyCash = async (req, res) => {
    const pettycashID = req.params.id;

    try {
        const deletedPetty = await Petty.findByIdAndDelete(pettycashID);
        if (!deletedPetty) {
            return res.status(404).send({ status: "Petty cash expense not found!" });
        }
        res.status(200).send({ status: "Petty cash expense deleted!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with deleting data!", error: err.message });
    }
};

// Get a specific petty cash expense
const getPettyCashById = async (req, res) => {
    const pettycashID = req.params.id;

    try {
        const petty = await Petty.findById(pettycashID);
        res.status(200).send({ status: "Petty cash expense fetched!", petty });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with fetching data!", error: err.message });
    }
};

module.exports = {
    addPettyCash,
    getAllPettyCash,
    updatePettyCash,
    deletePettyCash,
    getPettyCashById
};