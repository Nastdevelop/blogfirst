import nodemailer from "nodemailer";

export async function sendOTP(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "OTP Verifikasi",
    text: `Kode OTP kamu: ${code}`,
  });
}