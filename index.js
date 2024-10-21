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

// Body Parser configuration
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// CORS middleware setup
app.use(cors());
app.use(
  cors({
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://localhost:3000"); // or '*'
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
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
