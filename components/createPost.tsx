"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {

  
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      alert("Gagal membuat post");
      return;
    }

    alert("Post berhasil dibuat");

    router.push("/");
  };

  return (
    <div className="mx-auto flex flex-col mt-20 gap-10 bg-zinc-400 p-5 rounded-[5%] w-80">
      <h1 className="text-center font-bold">Buat Post</h1>

      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
        className="border"
      />


      <textarea
        placeholder="Content"
        onChange={(e) => setContent(e.target.value)}
        className="border"
      />


      <button onClick={handleCreate} className="bg-blue-600 w-[100px] mx-auto">
        Create
      </button>
    </div>
  );
}