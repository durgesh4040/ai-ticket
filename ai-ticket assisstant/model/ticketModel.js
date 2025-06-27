import mongoose from "mongoose";
const ticketSchema=new mongoose.Schema({
    title:String,
    description:String,
    status:{type:String,default:"TODO"},
    createdBy:{type:mongoose.Schema.Types.ObjectId ,ref:"User"},
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    priority:String,
    deadline:Date,
    helpfulNotes:String,
    relatedSkills:String,
    createdAt:{type:Date,default:Date.now}
})
const ticketModel=mongoose.model("ticket",ticketSchema);
export default ticketModel;