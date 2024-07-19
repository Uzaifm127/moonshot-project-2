import { config } from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

config();

export const sendEmail = async (email: string) => {
  // Generating a code
  const min = 10000000;
  const max = 99999999;

  const code = crypto.randomInt(min, max + 1);

  // Sending the email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: "Verification Code",
    html: `<h3>Here is your verification code: ${code}</h3>`,
  };

  await transporter.sendMail(mailOptions);

  return code;
};
