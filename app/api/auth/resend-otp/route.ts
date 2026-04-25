import prisma from "@/lib/prisma";
import { sendOTP } from "@/lib/mailer";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email wajib" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // 🔥 HAPUS OTP LAMA
    await prisma.oTP.deleteMany({
      where: { userId: user.id },
    });

    // 🔥 BUAT OTP BARU
    const code = generateOTP();

    await prisma.oTP.create({
      data: {
        code,
        userId: user.id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // 🔥 KIRIM EMAIL
    await sendOTP(email, code);

    return Response.json({ message: "OTP baru dikirim" });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}