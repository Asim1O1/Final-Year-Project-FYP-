import transporter from "../config/mailer.js";

const replacePlaceholders = (template, data) => {
  let result = template;
  for (const key in data) {
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, data[key]);
  }
  return result;
};

export const sendEmail = async (to, subject, template, data) => {
  try {
 
    const htmlContent = replacePlaceholders(template.body, data);

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text: htmlContent, // Plain text version (optional)
      html: htmlContent, // HTML version
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Send Email Error:", error.message);
    throw new Error("Failed to send email");
  }
};
