import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
const {id} = await params
  const postId = Number(id);

  if (isNaN(postId)) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { title, content } = await req.json();

  if (!title) {
    return Response.json({ error: "Title wajib diisi" }, { status: 400 });
  }

  // 🔥 cek post
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return Response.json({ error: "Post tidak ditemukan" }, { status: 404 });
  }

  const userId = Number((session.user as { id: string }).id);

  // 🔥 cek owner
  if (post.authorId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
    },
  });

  return Response.json(updated);
}