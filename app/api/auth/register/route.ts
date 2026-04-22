import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { generateOTP } from "@/lib/otp";
import { sendOTP } from "@/lib/mailer";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    // validasi
    if (!email || !name || !password) {
      return Response.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return Response.json(
        { error: "Gunakan email yang valid" },
        { status: 400 }
      );
    }

    // cek user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user (BELUM VERIFIED)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isVerified: false, // 🔥 penting
      },
    });

    // hapus OTP lama
    await prisma.oTP.deleteMany({
      where: { userId: user.id },
    });

    const code = generateOTP();

    await prisma.oTP.create({
      data: {
        code,
        userId: user.id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // kirim email (tidak boleh bikin crash)
    try {
      await sendOTP(email, code);
    } catch (err) {
      console.error("Email gagal:", err);
    }

    return Response.json({
      message: "OTP dikirim",
      email,
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}