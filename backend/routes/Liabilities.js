const router = require('express').Router();
let Liability = require('../models/Liability');


router.route("/add").post((req,res)=>{
    const ID = req.body.ID;
    const liabilityName = req.body.liabilityName;
    const liabilityType = req.body.liabilityType;
    const liabDate = Date.parse(req.body.liabDate);
    const liabilityAmount = req.body.liabilityAmount;

    const newLiability = new Liability({
        ID,
        liabilityName,
        liabilityType,
        liabDate,
        liabilityAmount
    })

    newLiability.save().then(()=>{
        res.json("Liability added!");
    }).catch((err)=>{
        console.log(err);
    })

})

router.route("/").get((req,res)=>{
    Liability.find().then((liability)=>{
        res.json(liability);
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/update/:id").put(async(req,res) =>{
    let liabilityID = req.params.id;
    const {ID,liabilityName,liabilityType,liabDate,liabilityAmount} = req.body;

    const updateLiability = {
        ID,
        liabilityName,
        liabilityType,
        liabDate,
        liabilityAmount
    }

    const update = await Liability.findByIdAndUpdate(liabilityID,updateLiability).then(() =>{
        
    res.status(200).send({status : "Liability updated!"})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status : "Error with updating data!"})
    })
})



router.route("/delete/:id").delete(async(req,res) =>{
    let liabilityID = req.params.id;

    await Liability.findByIdAndDelete(liabilityID).then(() => {
        res.status(200).send({status : "Liability deleted!"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status : "Error with deleting data!"});
    })
})

router.route("/get/:id").get(async(req,res) =>{
    let liabilityID = req.params.id;
    const liability = await Liability.findById(liabilityID).then((liability) => {
        res.status(200).send({status : "Liability fetched!", liability});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status : "Error with fetching data!", error : err.message});
    })
})




module.exports = router;