const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const liabilitySchema = new Schema({
    ID : {
        type : String,
        required : true
    },
    liabilityName : {
        type : String,
        required : true
    },
   liabilityType : {
        type : String,
        enum : ['Non-current', 'Current'],
        required : true
    },
    liabDate : {
        type : Date,
        required : true
    },
    liabilityAmount : {
        type : Number,
        required : true
    }

})

const Liability = mongoose.model("Liability", liabilitySchema);

module.exports = Liability;