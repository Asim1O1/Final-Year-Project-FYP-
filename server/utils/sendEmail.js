import transporter from "../config/mailer.js";

export const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Send Email Error:", error.message);
    throw new Error("Failed to send email");
  }
};
