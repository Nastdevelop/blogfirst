import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendOTP } from "@/lib/mailer";

// validasi email sederhana
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// generate OTP 6 digit
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    // 🔒 VALIDASI INPUT
    if (!email || !name || !password) {
      return Response.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return Response.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // 🔍 CEK USER
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 CREATE USER (BELUM VERIFIED)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isVerified: false,
      },
    });

    // 🧹 HAPUS OTP LAMA (kalau ada)
    await prisma.oTP.deleteMany({
      where: { userId: user.id },
    });

    // 🔢 BUAT OTP
    const code = generateOTP();

    // 💾 SIMPAN OTP
    await prisma.oTP.create({
      data: {
        code,
        userId: user.id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 menit
      },
    });

    // 📧 KIRIM EMAIL (tidak bikin crash)
    try {
      await sendOTP(email, code);
      console.log("OTP SENT TO:", email);
    } catch (err) {
      console.error("EMAIL ERROR:", err);
      // tetap lanjut biar user tidak gagal register
    }

    return Response.json({
      message: "Register berhasil, OTP dikirim",
      email,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return Response.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}