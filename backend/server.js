import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

const app= express();
dotenv.config();


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

import product from "./routes/product_route.js";


app.use("/products",product)

app.listen(PORT,()=>{
    console.log(`Server is up and running on port ${PORT}`)
})