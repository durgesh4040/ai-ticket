import userModel from "../../model/userModel.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../util/mailer.js";
import { inngest } from "../client.js";

export const onUserSignup = inngest.createFunction(
    { id: "on-user-signup", retries: 2 },
    { event: "user/signup" },
    async ({ event, step }) => {
        try {
            const { email } = event.data;
            if (!email) {
                console.error("No email provided in event data");
                throw new NonRetriableError("Email is required");
            }
            
            console.log(`Processing signup for email: ${email}`);

            const user = await step.run("get-user-email", async () => {
                console.log(`Looking for user with email: ${email}`);
                const userObject = await userModel.findOne({ email });
                
                if (!userObject) {
                    console.error(`User with email ${email} not found in database`);
                    throw new NonRetriableError("User no longer exists in our database");
                }
                
                console.log(`User found: ${userObject._id}`);
                return userObject;
            });

            await step.run("send-welcome-email", async () => {
                try {
                    const subject = 'Welcome to the app';
                    const message = `Hi ${user.name || 'there'},

Thanks for signing up! We're glad to have you onboard!

Best regards,
The Team`;

                    console.log(`Sending welcome email to: ${user.email}`);
                    
                    const result = await sendMail(user.email, subject, message);
                    
                    console.log(`Email sent successfully to: ${user.email}`, result);
                    return result;
                    
                } catch (emailError) {
                    console.error(`Failed to send email to ${user.email}:`, emailError);
                    throw emailError;
                }
            });

            console.log(`Signup process completed successfully for: ${email}`);
            return { success: true };
            
        } catch (error) {
            console.error("Error running signup steps:", error);
            if (error instanceof NonRetriableError) {
                console.error("Non-retriable error occurred:", error.message);
            } else {
                console.error("Retriable error occurred, will retry:", error.message);
            }
            
            return { success: false, error: error.message };
        }
    }
);