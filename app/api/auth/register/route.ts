import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();

  const { email, name, password } = body;

  // validasi
  if (!email || !name || !password) {
    return Response.json(
      { error: "Semua field wajib diisi" },
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

  // create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  return Response.json(
    {
      message: "Register berhasil",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    },
    { status: 201 }
  );
}