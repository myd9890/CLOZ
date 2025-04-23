const Liability = require('../models/Liability');

// Add a new liability
const addLiability = async (req, res) => {
    const { ID, liabilityName, liabilityType, liabDate, liabilityAmount } = req.body;

    const newLiability = new Liability({
        ID,
        liabilityName,
        liabilityType,
        liabDate: Date.parse(liabDate),
        liabilityAmount,
    });

    try {
        await newLiability.save();
        res.json("Liability added!");
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with adding liability", error: err.message });
    }
};

// Get all liabilities
const getLiabilities = async (req, res) => {
    try {
        const liabilities = await Liability.find();
        res.json(liabilities);
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with fetching liabilities", error: err.message });
    }
};

// Update a liability
const updateLiability = async (req, res) => {
    const liabilityID = req.params.id;
    const { ID, liabilityName, liabilityType, liabDate, liabilityAmount } = req.body;

    const updateLiability = {
        ID,
        liabilityName,
        liabilityType,
        liabDate,
        liabilityAmount,
    };

    try {
        await Liability.findByIdAndUpdate(liabilityID, updateLiability);
        res.status(200).send({ status: "Liability updated!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with updating data!", error: err.message });
    }
};

// Delete a liability
const deleteLiability = async (req, res) => {
    const liabilityID = req.params.id;

    try {
        await Liability.findByIdAndDelete(liabilityID);
        res.status(200).send({ status: "Liability deleted!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with deleting data!", error: err.message });
    }
};

// Get a specific liability
const getLiabilityById = async (req, res) => {
    const liabilityID = req.params.id;

    try {
        const liability = await Liability.findById(liabilityID);
        res.status(200).send({ status: "Liability fetched!", liability });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with fetching data!", error: err.message });
    }
};

module.exports = {
    addLiability,
    getLiabilities,
    updateLiability,
    deleteLiability,
    getLiabilityById,
};