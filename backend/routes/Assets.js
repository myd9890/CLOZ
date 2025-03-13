const router = require('express').Router();
let Asset = require('../models/Asset');


router.route("/add").post((req,res)=>{
    const ID = req.body.ID;
    const assetName = req.body.assetName;
    const assetType = req.body.assetType;
    const purchaseDate = Date.parse(req.body.purchaseDate);
    const assetValue = req.body.assetValue;

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

router.route("/update/:id").put(async(req,res) =>{
    let assetID = req.params.id;
    const {ID,assetName,assetType,purchaseDate,assetValue} = req.body;

    const updateAsset = {
        ID,
        assetName,
        assetType,
        purchaseDate,
        assetValue
    }

    const update = await Asset.findByIdAndUpdate(assetID,updateAsset).then(() =>{
        
    res.status(200).send({status : "Asset updated!"})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status : "Error with updating data!"})
    })
})



router.route("/delete/:id").delete(async(req,res) =>{
    let assetID = req.params.id;

    await Asset.findByIdAndDelete(assetID).then(() => {
        res.status(200).send({status : "Asset deleted!"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status : "Error with deleting data!"});
    })
})

router.route("/get/:id").get(async(req,res) =>{
    let assetID = req.params.id;
    const asset = await Asset.findById(assetID).then((asset) => {
        res.status(200).send({status : "Asset fetched!", asset});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status : "Error with fetching data!", error : err.message});
    })
})




module.exports = router;