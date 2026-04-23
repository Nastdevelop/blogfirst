import { Resend } from "resend";  

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTP(email: string, code: string) {
  try {
    await resend.emails.send({
      from: "OTP App <onboarding@resend.dev>", // default domain Resend
      to: email,
      subject: "Kode OTP Verifikasi",
      html: `
        <div style="font-family: sans-serif">
          <h2>Verifikasi Akun</h2>
          <p>Kode OTP kamu:</p>
          <h1 style="letter-spacing: 4px">${code}</h1>
          <p>jangan berikan code ini pada siapapun</p>
        </div>
      `,
    });

    console.log("EMAIL SENT ✔️");
  } catch (err) {
    console.error("RESEND ERROR:", err);
    throw err;
  }
}