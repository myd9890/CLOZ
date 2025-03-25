const express= require("express");
const mongoose= require("mongoose");
const dotenv=require("dotenv");
const cors= require("cors");
const bodyParser= require("body-parser");
const app= express();
require("dotenv").config();

const PORT=process.env.PORT||8070;

app.use(cors());
app.use(bodyParser.json());

const URL=process.env.MONGODB_URL;

mongoose.connect(URL,{
   
    useNewUrlParser:true,
    useUnifiedTopology:true,

});

const connection =mongoose.connection;
connection.once("open",()=>{
    console.log("Mongodb connection success!");
})

const assetRouter = require("./routes/Assets.js");
app.use("/assets",assetRouter);

const liabilityRouter = require("./routes/Liabilities.js");
app.use("/liabilities",liabilityRouter);

const expenseRouter = require("./routes/Expenses.js");
app.use("/expenses",expenseRouter);

const pettyRouter = require("./routes/pettyCashexp.js");
app.use("/pettycash",pettyRouter);


app.listen(PORT,()=>{
    console.log(`Server is up and running on port ${PORT}`)
})
