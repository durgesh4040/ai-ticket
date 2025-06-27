import { inngest } from "../client.js";
import ticketModel from "../../model/ticketModel.js";
import userModel from "../../model/userModel.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../util/mailer.js";
import analyzeTicket from "../../util/ai.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event, step }) => {
    try {
      const { ticketId } = event.data;

      const ticket = await step.run("fetch-ticket", async () => {
        const ticketObject = await ticketModel.findById(ticketId);
        if (!ticketObject) {
          throw new NonRetriableError("Ticket not found");
        }
        return ticketObject;
      });

      await step.run("update-ticket-status", async () => {
        await ticketModel.findByIdAndUpdate(ticket._id, { status: "TODO" });
      });

      const aiResponse = await analyzeTicket(ticket);

      const relatedskills = await step.run("ai-processing", async () => {
        let skills = [];
        if (aiResponse) {
          await ticketModel.findByIdAndUpdate(ticket._id, {
            priority: !["low", "medium", "high"].includes(aiResponse.priority)
              ? "medium"
              : aiResponse.priority,
            helpfulNotes: aiResponse.helpfulNotes,
            status: "IN_PROGRESS",
            relatedSkills: aiResponse.relatedSkills,
          });
          skills = aiResponse.relatedSkills;
        }
        return skills;
      });

      const moderator = await step.run("assign-moderator", async () => {
        let user = await userModel.findOne({
          role: "moderator",
          skills: {
            $elemMatch: {
              $regex: relatedskills.join("|"),
              $options: "i",
            },
          },
        });
        if (!user) {
          user = await userModel.findOne({ role: "admin" });
        }
        await ticketModel.findByIdAndUpdate(ticket._id, {
          assignedTo: user?._id || null,
        });
        return user;
      });

      await step.run("send-email-notification", async () => {
        if (moderator) {
          const finalTicket = await ticketModel.findById(ticket._id);
          await sendMail({
            to: moderator.email,
            subject: "Ticket Assigned",
            html: `A new ticket has been assigned to you: <strong>${finalTicket.title}</strong>`,
          });
        }
      });

      return { success: true };

    } catch (err) {
      console.error("Error running the step:", err.message);
      return { success: false };
    }
  }
);
