import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ email, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.APP_NAME || "TaskFlow"} <onboarding@resend.dev>`,
      to: email,
      subject,
      html,
    });

    if (error) {
      console.error("EMAIL SEND FAILED:", error.message);
      throw new Error(error.message);
    }

    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error("EMAIL SEND FAILED:", error.message);
    throw error;
  }
};

export default sendMail;