const Asset = require('../models/Asset');

const addAsset = async (req, res) => {
    const { ID, assetName, assetType, purchaseDate, assetValue } = req.body;

    const newAsset = new Asset({
        ID,
        assetName,
        assetType,
        purchaseDate: Date.parse(purchaseDate),
        assetValue
    });

    try {
        await newAsset.save();
        res.json("Asset added!");
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with adding asset", error: err.message });
    }
};

const getAllAssets = async (req, res) => {
    try {
        const assets = await Asset.find();
        res.json(assets);
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with fetching assets", error: err.message });
    }
};

const updateAsset = async (req, res) => {
    const assetID = req.params.id;
    const { ID, assetName, assetType, purchaseDate, assetValue } = req.body;

    const updateAsset = {
        ID,
        assetName,
        assetType,
        purchaseDate,
        assetValue
    };

    try {
        await Asset.findByIdAndUpdate(assetID, updateAsset);
        res.status(200).send({ status: "Asset updated!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with updating asset", error: err.message });
    }
};

const deleteAsset = async (req, res) => {
    const assetID = req.params.id;

    try {
        await Asset.findByIdAndDelete(assetID);
        res.status(200).send({ status: "Asset deleted!" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with deleting asset", error: err.message });
    }
};

const getAssetById = async (req, res) => {
    const assetID = req.params.id;

    try {
        const asset = await Asset.findById(assetID);
        res.status(200).send({ status: "Asset fetched!", asset });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with fetching asset", error: err.message });
    }
};

module.exports = {
    addAsset,
    getAllAssets,
    updateAsset,
    deleteAsset,
    getAssetById
};