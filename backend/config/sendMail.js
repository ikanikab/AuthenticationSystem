import { createTransport } from 'nodemailer';

const sendMail = async ({ email, subject, html }) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10000, // 10s — fail fast instead of hanging
  });

  try {
    await transport.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      html,
    });
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error("EMAIL SEND FAILED:", error.message);
    throw error; // let TryCatch in the controller catch and report this
  }
};

export default sendMail;