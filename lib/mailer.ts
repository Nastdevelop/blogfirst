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
  } catch (error) {
    console.error("EMAIL ERROR FULL:", error);
    throw error;
  }
}