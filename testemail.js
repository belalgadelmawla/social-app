import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testSend() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Test Sender" <${process.env.EMAIL}>`,
    to: "ايميلك انت@gmail.com",
    subject: "Hello from Nodemailer",
    text: "This is a test email!"
  });

  console.log("Message sent: ", info.messageId);
}

testSend().catch(console.error);
