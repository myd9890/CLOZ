const router = require('express').Router();
let Asset = require('../models/Asset');


router.route("/add").post((req,res)=>{
    const ID = req.body.ID;
    const assetName = req.body.assetName;
    const assetType = req.body.assetType;
    const purchaseDate = Date.parse(req.body.purchaseDate);
    const assetValue = Double(req.body.assetValue);

    const newAsset = new Asset({
        ID,
        assetName,
        assetType,
        purchaseDate,
        assetValue
    })

    newAsset.save().then(()=>{
        res.json("Asset added!");
    }).catch((err)=>{
        console.log(err);
    })

})

router.route("/").get((req,res)=>{
    Asset.find().then((asset)=>{
        res.json(asset);
    }).catch((err)=>{
        console.log(err);
    })
})

module.exports = router;