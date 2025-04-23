const router = require('express').Router();
const {
    addAsset,
    getAllAssets,
    updateAsset,
    deleteAsset,
    getAssetById
} = require('../controllers/assetController');

router.post("/add", addAsset);
router.get("/", getAllAssets);
router.put("/update/:id", updateAsset);
router.delete("/delete/:id", deleteAsset);
router.get("/get/:id", getAssetById);

module.exports = router;