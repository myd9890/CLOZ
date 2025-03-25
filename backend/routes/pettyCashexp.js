const router = require('express').Router();
let Petty = require('../models/pettyCash');


router.route("/add").post((req,res)=>{
    const ID = req.body.ID;
    const expense = req.body.expense;
    const Type = req.body.Type;
    const expDate = Date.parse(req.body.expDate);
    const Amount = req.body.Amount;

    const newPetty = new Petty({
        ID,
        expense,
        Type,
        expDate,
        Amount
    })

    newPetty.save().then(()=>{
        res.json("Petty cash expense added!");
    }).catch((err)=>{
        console.log(err);
    })

})

router.route("/").get((req,res)=>{
    Petty.find().then((petty)=>{
        res.json(petty);
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/update/:id").put(async(req,res) =>{
    let pettycashID = req.params.id;
    const {ID,expense,Type,expDate,Amount} = req.body;

    const updatePetty = {
        ID,
        expense,
        Type,
        expDate,
        Amount
    }

    const update = await Petty.findByIdAndUpdate(pettycashID,updatePetty).then(() =>{
        
    res.status(200).send({status : "Petty cash expense updated!"})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status : "Error with updating data!"})
    })
})



router.route("/delete/:id").delete(async(req,res) =>{
    let pettycashID = req.params.id;

    await Petty.findByIdAndDelete(pettycashID).then(() => {
        res.status(200).send({status : "Petty cash expense deleted!"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status : "Error with deleting data!"});
    })
})

router.route("/get/:id").get(async(req,res) =>{
    let pettycashID = req.params.id;
    const petty = await Petty.findById(pettycashID).then((petty) => {
        res.status(200).send({status : "Petty cash expense fetched!", petty});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status : "Error with fetching data!", error : err.message});
    })
})




module.exports = router;