export const dynamic = "force-dynamic";
import Postcard from "@/components/postcard";
import prisma from "@/lib/prisma";

export default async function Home() {

  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { id: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">
        Semua Blog 📝
      </h1>

      
        <div className="space-y-4">
          {posts.map((post) => (
<Postcard key={post.id} post={post}  />
          ))}
        </div>
      
    </div>
  );
}