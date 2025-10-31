
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { transport, sender } from "./mailtrap.config.js"

export const sendVerficationEmail = async (email, verificationToken) => {
    const recipient = [email]

    try {
        const response = await transport.sendMail({
            from: sender,
            to: recipient,
            subject: "Email verification.",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });

        console.log("Email sent successfully", response)
    } catch (error) {
        console.log('Error in sending verfification email', error);

        throw new Error(`Error sending verification email:${error}`) //This stops the current function and sends the error upward to be handled elsewhere (for example, by a global error handler or controller).
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [email];
    try {

        const response = await transport
            .sendMail({
                from: sender,
                to: recipient,
                subject: "Email verification",
                html: WELCOME_EMAIL_TEMPLATE.replace("{name}",name),
                category:"Welcome Email",
            });

        console.log("welcome Email sent successfully", response);
    } catch (error) {

        console.log('Error in sending welcome email', error);

        throw new Error(`Error sending welcome email:${error}`) //This stops the current function and sends the error upward to be handled elsewhere (for example, by a global error handler or controller).

    }
}