import http from "http";
import mongoose from "mongoose";
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

const corsOptions = {
  origin: "http://localhost:3000", // Use "http" if you are testing locally
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS with the specific configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Match origin to CORS options
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Respond OK for pre-flight check
  }
  next();
});

app.use("/auth", authRouter);
app.use("/loan", loanRouter);
app.use("/", (req, res) => {
  res.send("Hello Guys, it's not working");
});

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "assign" })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
