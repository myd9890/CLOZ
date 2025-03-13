const router = require('express').Router();
const Expense = require('../models/Expense');
let Asset = require('../models/Expense');


router.route("/add").post((req,res)=>{
    const ID = req.body.ID;
    const expense = req.body.expense;
    const expenseType = req.body.expenseType;
    const Date = Date.parse(req.body.Date);
    const Amount = req.body.Amount;

    const newExpense = new Expense({
        ID,
        expense,
        expenseType,
        Date,
        Amount
    })

    newExpense.save().then(()=>{
        res.json("Expense added!");
    }).catch((err)=>{
        console.log(err);
    })

})

router.route("/").get((req,res)=>{
    Expense.find().then((asset)=>{
        res.json(expense);
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/update/:id").put(async(req,res) =>{
    let expenseID = req.params.id;
    const {ID,expense,expenseType,Date,Amount} = req.body;

    const updateExpense = {
        ID,
        expense,
        expenseType,
        Date,
        Amount
    }

    const update = await Expense.findByIdAndUpdate(expenseID,updateExpense).then(() =>{
        
    res.status(200).send({status : "Expense updated!"})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status : "Error with updating data!"})
    })
})



router.route("/delete/:id").delete(async(req,res) =>{
    let expenseID = req.params.id;

    await Expense.findByIdAndDelete(expenseID).then(() => {
        res.status(200).send({status : "Expense deleted!"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status : "Error with deleting data!"});
    })
})

router.route("/get/:id").get(async(req,res) =>{
    let expenseID = req.params.id;
    const expense = await Expense.findById(expenseID).then((expense) => {
        res.status(200).send({status : "Expense fetched!", expense});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status : "Error with fetching data!", error : err.message});
    })
})




module.exports = router;