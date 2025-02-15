import nodemailer from "nodemailer";
import appConfig from "./appConfig.js";

const transporter = nodemailer.createTransport({
  host: appConfig.smtp_host,
  port: appConfig.smtp_port,
  secure: appConfig.smtp_secure === "true",
  auth: {
    user: appConfig.smtp_user,
    pass: appConfig.smtp_pass,
  },
});

export default transporter;
