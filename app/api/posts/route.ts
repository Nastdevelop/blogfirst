import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { title, content } = body;

  if (!title) {
    return Response.json(
      { error: "Title wajib diisi" },
      { status: 400 }
    );
  }

  const authorId = Number((session.user as any).id);

  if (isNaN(authorId)) {
    return Response.json({ error: "Invalid user id" }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId
    },
  });

  return Response.json(post);
}