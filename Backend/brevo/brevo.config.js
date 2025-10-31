import Nodemailer from "nodemailer";


import dotenv from 'dotenv';

dotenv.config();



export const transport = Nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_USER, // your Brevo login email
    pass: process.env.BREVO_SMTP_KEY, // your SMTP key
  }
});

export const sender = {
  address: process.env.SENDER_EMAIL,
  name: "Auth Company",
};

// const recipients = [
//   "pookiepoo963@gmail.com",
// ];


// this should be done while importing and using the below code (the recipients should be array of emails like in above).
// transport
//   .sendMail({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//   })
//   .then(console.log, console.error);