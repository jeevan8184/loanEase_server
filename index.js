
import http from "http";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.route.js"
import loanRouter from "./routes/loan.route.js"

dotenv.config();
const app=express();

app.use(bodyParser.json({limit:"50mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"50mb",extended:true}));
app.use(cors());


mongoose.connect(process.env.MONGODB_URI,{dbName:"assign"}).catch((err) => console.log(err)).then(()=> console.log("mongodb connected"));

app.use("/auth",authRouter);
app.use("/loan",loanRouter);

app.listen(process.env.PORT,()=> console.log(`Server is running on port ${process.env.PORT}`));

















