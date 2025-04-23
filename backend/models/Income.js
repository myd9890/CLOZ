const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
    ID : {
        type : String,
        required : true
    },
    Income : {
        type : String,
        required : true
    },
    
    Date : {
        type : Date,
        required : true
    },
    Amount : {
        type : Number,
        required : true
    }

})

const Income = mongoose.model("Income", incomeSchema);

module.exports = Income;