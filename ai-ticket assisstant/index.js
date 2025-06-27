import express from "express";
import mongoose from "mongoose"
import cors from "cors";
import userRoutes from "./router/user.js";
import ticketRoutes from "./router/ticket.js";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/function/on-signup.js";
import { onTicketCreated } from "./inngest/function/on-ticket-create.js";
import { serve } from "inngest/express";
import dotenv from "dotenv";
dotenv.config();



const PORT=process.env.PORT || 3000

const app=express();
app.use(cors());
app.use(express.json());


app.use(
  "/api/inngest",
  serve({
    client:inngest,
    functions:[onUserSignup,onTicketCreated]

  })
)

app.use("/api/auth",userRoutes);
app.use("/api/tickets",ticketRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(()=>{
    console.log("MongoDB connected");
    app.listen(PORT,()=>console.log("Server at http://localhost:3000"))
  })
  .catch((err)=>console.log("Mongodb erro:",err))