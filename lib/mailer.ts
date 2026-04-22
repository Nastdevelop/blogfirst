import nodemailer from "nodemailer";

export async function sendOTP(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
});
console.log("USER:", process.env.SMTP_USER);
console.log("PASS:", process.env.SMTP_PASS); 

  await transporter.sendMail({
    from: `"OTP Service" <${process.env.SMTP_USER}>`, // 🔥 penting
    to: email,
    subject: "OTP Verifikasi",
    text: `Kode OTP kamu: ${code}`,
  });
} 