import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

import dotenv from 'dotenv';

dotenv.config();



export const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.MAILTRAP_TOKEN,
  })
);

export const sender = {
  address: "hello@demomailtrap.co",
  name: "Achyuth J.",
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
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);