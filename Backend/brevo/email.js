
import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { transport, sender } from "./brevo.config.js"

export const sendVerficationEmail = async (email, verificationToken) => {
    const recipient = [email]

    try {
        const response = transport.sendMail({
            from: sender,
            to: recipient,
            subject: "Email verification",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            
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

        const response = transport
            .sendMail({
                from: sender,
                to: recipient,
                subject: "Welcome to Auth Company!",
                html: WELCOME_EMAIL_TEMPLATE.replace("{name}",name),
                
            });

        console.log("welcome Email sent successfully", response);
    } catch (error) {

        console.log('Error in sending welcome email', error);

        throw new Error(`Error sending welcome email:${error}`) //This stops the current function and sends the error upward to be handled elsewhere (for example, by a global error handler or controller).

    }
}

export const sendPasswordResetEmail = async (email,resetURL) => {
    const recipient = [email];
    try {
        const response = transport.sendMail({
            from:sender,
            to:recipient,
            subject:"Reset your password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            
        })
        console.log("reset password Email sent successfully", response);
    } catch (error) {
        console.error("Error sending password reset email", error);
        throw new Error(`Error sending password reset email:${error}`);
    }
}