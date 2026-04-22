import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return Response.json(
      { error: "Email dan OTP wajib diisi" },
      { status: 400 }
    );
  }

  const normalizedCode = String(code).trim();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return Response.json(
      { error: "User tidak ada" },
      { status: 404 }
    );
  }

  const otp = await prisma.oTP.findFirst({
    where: {
      userId: user.id,
      code: normalizedCode,
    },
    orderBy: { id: "desc" }, // ganti ke createdAt kalau ada
  });

  if (!otp) {
    return Response.json(
      { error: "OTP salah" },
      { status: 400 }
    );
  }

  if (otp.expiresAt < new Date()) {
    return Response.json(
      { error: "OTP expired" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });

  await prisma.oTP.deleteMany({
    where: { userId: user.id },
  });

  return Response.json({ message: "Akun aktif" });
}