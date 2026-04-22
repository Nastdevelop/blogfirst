import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Cardadmin from "./Cardadmin";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const userId = Number(session.user.id);

  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">
        Dashboard: {session.user.name}
      </h1>

      {posts.map((post) => (
        <Cardadmin key={post.id} post={post} />
      ))}
    </div>
  );
}