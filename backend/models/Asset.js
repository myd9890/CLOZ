const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assetSchema = new Schema({
    ID: {
        type: String,
        required: true,
        unique: true,
    },
    assetName: {
        type: String,
        required: true
    },
    assetType: {
        type: String,
        enum: ['Non-current', 'Current'],
        required: true
    },
    purchaseDate: {
        type: Date,
        required: true
    },
    assetValue: {
        type: Number,
        required: true
    }
});

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;
