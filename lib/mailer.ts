import nodemailer from "nodemailer";

export async function sendOTP(email: string, code: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"OTP App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Kode OTP Verifikasi",
      text: `Kode OTP kamu: ${code}`,
    });

    console.log("EMAIL SENT:", info.response);
    console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "ADA" : "KOSONG");
  } catch (error) {
    console.error("EMAIL ERROR FULL:", error);
    throw error;
  }
}