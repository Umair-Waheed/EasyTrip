

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "easytripsite@gmail.com", // match below
    pass: "wvlezcspabzmewfm"              // use app password
  }
});

transporter.verify().then(() => console.log("✅ Mailer ready")).catch(err => console.error("Mailer error", err));

export default async function sendEmail(to, subject, html) {
  const info = await transporter.sendMail({
    from: "easytripsite@gmail.com", // match above, not process.env
    to,
    subject,
    html
  });
  return info;
}
