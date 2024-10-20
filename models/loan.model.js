import mongoose, { Schema } from "mongoose";

const LoanSchema=new Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    interest:{
        type:Number,
        required:true
    },
    loanTerm:{
        type:String,
        enum:['1 month','2 month','3 month','4 month','5 month','6 month','1 year',],
        required:true
    },
    frequency:{
        type:String,
        enum:['weekly','bi-weekly','monthly'],
        required:true
    },
    loanDate:{
        type:Date,
        required:true,
        default:Date.now
    },
    loanStatus:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    },updatedAt:{
        type:Date,
        default:Date.now
    },
    approvedAt:{
        type:Date,
    },
    rejectedAt:{
        type:Date,
    },
    schedule:[{
        term:{type:Number},
        amt:{type:Number},
        dueDate:{type:Date},
        status:{type:String, enum:['pending','paid','overdue'], default:'pending'}
    }],
    totalPaid:{type:Number, default:0},
    totalDue:{type:Number, default:0},
    totalOverdue:{type:Number, default:0}
},{timestamps:true});

const Loan=mongoose.model('Loan',LoanSchema) || mongoose.models(Loan);

export default Loan;



