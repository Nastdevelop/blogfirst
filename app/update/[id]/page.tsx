import prisma from "@/lib/prisma";
import EditPostForm from "./editing";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = await params
  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    return <div>Post tidak ditemukan</div>;
  }

  return <EditPostForm post={post} />;
}