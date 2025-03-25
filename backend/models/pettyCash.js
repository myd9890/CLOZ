const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pettycashSchema = new Schema({
    ID : {
        type : String,
        required : true
    },
    expense : {
        type : String,
        required : true
    },
    Type : {
        type : String,
        enum : ['Debit', 'Credit'],
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

const Petty = mongoose.model("Petty", pettycashSchema);

module.exports = Petty;