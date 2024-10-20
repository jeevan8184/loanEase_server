
import express from "express";
import { checkMail, getAdminUser, getAllUsers, getUser, Login, OnBoard, resetPassword, sendMail, SignUp, UploadImg } from "../actions/auth.action.js";

const router=express.Router();

router.post('/login',Login);
router.post("/signup",SignUp);
router.get("/user/:id",getUser);
router.post("/upload",UploadImg);
router.post("/onBoard",OnBoard);
router.get("/checkMail",checkMail);
router.post("/sendMail",sendMail);
router.post("/reset",resetPassword);
router.get("/allUsers",getAllUsers);
router.get("/adminUser/:userId",getAdminUser);

export default router;

