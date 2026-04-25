"use client";

import { useRouter } from "next/navigation";
import { Post, User } from "@/app/generated/prisma/client";

type devinisi = Post & {
  author: User;
};

export default function Postcard({ post }: { post: devinisi }) {
  const router = useRouter();

  return (
    <div
      className="border p-4 w-180 rounded-lg shadow-sm flex justify-between cursor-pointer hover:shadow-md transition"
      onClick={() => router.push(`/post/${post.id}`)}
    >
      <div>
        <h2 className="text-lg font-semibold">{post.title}</h2>

        <p className="text-sm text-zinc-500">
          by {post.author.name}
        </p>

        <p className="mt-2 text-zinc-700 line-clamp-2">
        {post.content?.slice(0, 40)}...
        </p>
      </div>
    </div>
  );
}