import http from "http";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.route.js";
import loanRouter from "./routes/loan.route.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.options('*', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.sendStatus(204); // No content
});

const corsOpts = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOpts));


app.use("/auth", authRouter);
app.use("/loan", loanRouter);

app.use("/", (req, res) => {
  res.send("Hello Guys its not working");
});

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "assign" })
  .catch((err) => console.log(err))
  .then(() => console.log("mongodb connected"));

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
