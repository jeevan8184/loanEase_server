import express from "express";
import { ApproveLoan, checkOutOrder, createLoan, getAdminLoan, getAllLoans, getLoan, getRecentLoans, getUserLoans, RejectLoan, updateLoan, verifyPayment } from "../actions/loan.action.js";

const router=express.Router();

router.post("/create",createLoan);
router.get("/getAllLoans",getAllLoans);
router.get("/getLoan/:loanId",getLoan);
router.get("/get/:customerId",getUserLoans);
router.get("/getRecent/:date",getRecentLoans);
router.post("/approve",ApproveLoan);
router.post("/reject/:loanId",RejectLoan);
router.get("/getAdminLoan/:loanId",getAdminLoan);
router.post("/checkOut",checkOutOrder);
router.get("/verify/:sessionId",verifyPayment);
router.post("/update",updateLoan);

export default router;

