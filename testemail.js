import nodemailer from 'nodemailer';


async function testSend() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    tls: {
        rejectUnauthorized: false
      }
  });

  const info = await transporter.sendMail({
    from: `"Test Sender" <${process.env.EMAIL}>`,
    to: "belalmahmoudzaki@gmail.com",
    subject: "Hello from Nodemailer",
    text: "This is a test email!"
  });

  console.log("Message sent: ", info.messageId);
}

testSend().catch(console.error);
