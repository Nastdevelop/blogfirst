"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [resending, setResending] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (resending) return;

    setResending(true);

    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    setResending(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("OTP baru dikirim ke email kamu");
  };

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
      router.push("/");
    } catch (err) {
      console.error("VERIFY ERROR:", err);
      alert("Terjadi error");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <p className="text-white text-center mt-10">Email tidak ditemukan</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-800">
      <div className="bg-white shadow-lg rounded-xl px-8 py-10 w-[350px] flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-center text-zinc-800">
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
          className="border border-zinc-300 rounded-lg px-4 py-2 tracking-widest text-black text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Memverifikasi..." : "Verify"}
        </button>

        <div className="flex mx-auto items-center gap-1">
          <p className="text-black text-[12px] font-medium">
            Belum menerima kode otp?
          </p>

          <button
            onClick={handleResend}
            disabled={resending}
            className="text-blue-500 text-[11px] cursor-pointer hover:underline disabled:opacity-50"
          >
            {resending ? "Mengirim ulang..." : "Kirim ulang"}
          </button>
        </div>
      </div>
    </div>
  );
}