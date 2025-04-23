const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    ID : {
        type : String,
        required : true
    },
    expense : {
        type : String,
        required : true
    },
    expenseType : {
        type : String,
        enum : ['Distribution', 'Administrative', 'Financial', 'Other'],
        required : true
    },
    expDate : {
        type : Date,
        required : true
    },
    Amount : {
        type : Number,
        required : true
    }

})

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;