"use client";

import { useState, use } from "react";

export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const params = use(searchParams); // 🔥 unwrap Promise
  const email = params.email;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (loading) return;

    if (!code) {
      alert("Kode OTP wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Akun berhasil diaktifkan!");
    } catch (err) {
      console.error("VERIFY ERROR:", err);
      alert("Terjadi error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <div className="bg-white shadow-lg rounded-xl px-8 py-10 w-[350px] flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-center">
          Verifikasi OTP
        </h1>

        <p className="text-sm text-zinc-500 text-center">
          Masukkan kode OTP yang dikirim ke email kamu
        </p>

        <span className="block font-semibold text-zinc-800 text-center">
          {email}
        </span>

        <input
          type="text"
          placeholder="Kode OTP"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border border-zinc-300 rounded-lg px-4 py-2 tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Memverifikasi..." : "Verify"}
        </button>
      </div>
    </div>
  );
}