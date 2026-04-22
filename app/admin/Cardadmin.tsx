"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Post } from "@/app/generated/prisma/client";

export default function Cardadmin({ post }: { post: Post }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;

    const confirmDelete = confirm("Yakin hapus?");
    if (!confirmDelete) return;

    setLoading(true);

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Gagal hapus");
      setLoading(false);
      return;
    }

    router.refresh();
  };

  const handleUpdate = () => {
    router.push(`/update/${post.id}`);
  };

  return (
    <div className="border p-4 rounded-lg flex justify-between">
      <div>
        <h2 className="font-semibold">{post.title}</h2>
        <p className="text-sm text-zinc-500">
          {post.content?.slice(0, 50)}...
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-500 px-3 py-1 text-white rounded"
        >
          Delete
        </button>

        <button
          onClick={handleUpdate}
          className="bg-green-500 px-3 py-1 text-white rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
}