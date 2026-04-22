"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@/app/generated/prisma/client";

export default function EditPostForm({ post }: { post: Post }) {
  const router = useRouter();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (loading) return;

    setLoading(true);

    const res = await fetch(`/api/posts/update/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const err = await res.json()
      alert(err.error)
      setLoading(false)
      return
    }
    alert("Post berhasil diupdate");
    router.push(`/post/${post.id}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Edit Post</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2"
      />

      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
}