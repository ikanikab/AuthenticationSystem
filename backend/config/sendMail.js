import { createTransport } from 'nodemailer';
import dns from 'dns';

// Force IPv4 first — fixes ENETUNREACH on hosts without IPv6 egress (e.g. Render)
dns.setDefaultResultOrder('ipv4first');

const sendMail = async ({ email, subject, html }) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 587, //updated port
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
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
    throw error;
  }
};

export default sendMail;