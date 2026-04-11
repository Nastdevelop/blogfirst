import prisma from "@/lib/prisma";  

export default async function PostDetail({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const ambil = Number(id);
  const post = await prisma.post.findUnique({where: { id: ambil }, include: { author: true }})

  if (!post) {
    return <div>Postingan Halu</div>;
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold">{post.title}</h1>

      <p className="text-sm text-zinc-500">by {post.author.name}</p>

      <p className="mt-4">{post.content}</p>
    </div>
  );
}
