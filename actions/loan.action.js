
import mongoose from "mongoose";
import Loan from "../models/loan.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";

export const createLoan=async(req,res)=>{
    const {customerId,amount,interest,loanTerm,frequency}=req.body;

    try {
        const loan=new Loan({customerId,amount,interest,loanTerm,frequency});
        await loan.save();
        await User.updateOne({_id:customerId},{$push:{myLoans:loan._id}});
        res.status(201).json(loan);
    } catch (error) {
        console.log(error);   
    }
}

export const getUserLoans=async(req,res)=>{
    const {customerId}=req.params;
    try {
        if(!customerId) return res.status(404).json({message:"User not found"});
        const aggregate=await Loan.aggregate([
            {$match:{customerId:new mongoose.Types.ObjectId(customerId)}},
            {$sort:{createdAt:-1}}
        ]);
        
        return res.status(200).json(aggregate);
    } catch (error) {
        console.log(error);
    }
}

export const getLoan=async(req,res)=>{
    const {loanId}=req.params;
    try {
        if(!loanId) return res.status(404).json({message:"Invalid loanId"});
        const loan=await Loan.findById(loanId);
        res.status(200).json(loan);
    } catch (error) {
        console.log(error);
    }
}

export const getAllLoans=async(req,res)=>{
    try {
        const loans=await Loan.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"customerId",
                    foreignField:"_id",
                    as:"customer"
                }
            },
            {$unwind:"$customer"},
            {
                $project:{
                    customerId:0
                }
            },
            {$sort:{updatedAt:-1}}
        ]);

        res.status(200).json(loans);
    } catch (error) {
        console.log(error);
    }
}

export const getRecentLoans=async(req,res)=>{
    const date=req.params.date;
    try {
        const allLoans=await Loan.aggregate([
            {$match:{createdAt:date}},
            {
                $lookup:{
                    from:"users",
                    localField:"customerId",
                    foreignField:"_id",
                    as:"customer"
                }
            },
            {$unwind:"$customer"},
            {
                $project:{
                    customerId:0
                }
            },
            {$sort:{updatedAt:-1}},
        ])
        
    } catch (error) {
        console.log(error);
    }
}

export const ApproveLoan=async(req,res)=>{
    const {loanId,schedule}=req.body;
    try {
        if(!loanId) return res.status(404).json({message:"Invalid loanId"});
        await Loan.updateOne({_id:loanId},{$set:{loanStatus:"approved",approvedAt:new Date(),schedule}});

        const loans=await Loan.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"customerId",
                    foreignField:"_id",
                    as:"customer"
                }
            },
            {$unwind:"$customer"},
            {
                $project:{
                    customerId:0
                }
            },
            {$sort:{updatedAt:-1}}
        ]);
        return res.status(200).json(loans);
    } catch (error) {
        console.log(error);
    }
}

export const RejectLoan=async(req,res)=>{
    const {loanId}=req.params;
    console.log("Reject",loanId);
    try {
        if(!loanId) return res.status(404).json({message:"Invalid loanId"});
        await Loan.updateOne({_id:loanId},{$set:{loanStatus:"rejected",rejectedAt:new Date(),schedule:[]}});
        
        const loans=await Loan.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"customerId",
                    foreignField:"_id",
                    as:"customer"
                }
            },
            {$unwind:"$customer"},
            {
                $project:{
                    customerId:0
                }
            },
            {$sort:{updatedAt:-1}}
        ]);
        return res.status(200).json(loans);
    } catch (error) {
        console.log(error);
    }
}

export const getAdminLoan=async(req,res)=>{
    const {loanId}=req.params;
    try {
        if(!loanId) return res.status(404).json({message:"Invalid loanId"});

        const loans=await Loan.aggregate([
            {$match:{_id:new mongoose.Types.ObjectId(loanId)}},
            {
                $lookup:{
                    from:"users",
                    localField:"customerId",
                    foreignField:"_id",
                    as:"customer"
                }
            },
            {$unwind:"$customer"},
            {
                $project:{
                    customerId:0
                }
            },
            {$sort:{updatedAt:-1}},
            {$limit:1}
        ]);
        return res.status(200).json(loans[0]);
    } catch (error) {
        console.log(error);
    }
}

export const checkOutOrder=async(req,res)=>{
    const {amt,loanId,termId}=req.body;
    console.log("Checkout",amt,loanId,termId);

    try {
        const stripe=new Stripe(process.env.STRIPE_SECRET_KEY,{ apiVersion: '2022-11-15',});
        const session=await stripe.checkout.sessions.create({
            line_items: [
                {
                  price_data: {
                    currency: "inr",
                    product_data: {
                      name: "Product Name",
                    },
                    unit_amount: 100 * Number(amt),
                  },
                  quantity: 1,
                },
              ],
            mode:"payment",
            currency:"inr",
            success_url:`${process.env.FRONTEND_URL}/loanDetails/${loanId}?session_id={CHECKOUT_SESSION_ID}&term=${termId}`,
            cancel_url:`${process.env.FRONTEND_URL}/loanDetails/${loanId}`
        });
        res.status(200).json(session);     
    } catch (error) {
        console.log(error);
    }
}

export const verifyPayment=async(req,res)=>{
    const { sessionId } = req.params;
  try {
    const stripe=new Stripe(process.env.STRIPE_SECRET_KEY,{ apiVersion: '2022-11-15',});
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return res.json({ status: "paid" });
    } else {
      return res.json({ status: "failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to verify payment" });
  }
}

export const updateLoan = async (req, res) => {
    const { loanId, term } = req.body;
    console.log("updateLoan", term, loanId);
    try {
        if (!loanId) return res.status(400).json({ message: "Invalid loanId" });

        const existLoan = await Loan.findById(loanId);
        if (!existLoan) return res.status(404).json({ message: "Loan not found" });

        existLoan.schedule.forEach((schedule) => {
            if (schedule.term === Number(term)) {
                console.log("schedule",schedule);
                schedule.status = 'paid';
            }
        });

        await existLoan.save();
        return res.status(200).json(existLoan);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


