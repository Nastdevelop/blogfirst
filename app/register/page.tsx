"use client";

import Link from "next/link"
import { useState } from "react"; 
import { useRouter } from "next/navigation";


export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }
      alert("OTP sudah dikirim ke email");

      // kirim email ke halaman verify
      router.push(`/verify?email=${email}`)
    } catch (error) {
      console.error(error);
      alert("Terjadi error");
    }
  };

  return (
    <div className="mt-20 mx-auto flex flex-col gap-5 border rounded-[7px] px-10 py-5">
      <h1 className="text-center font-bold text-2xl mb-5 ">Register</h1>

      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        className="border border-zinc-300 rounded-[5px] w-[300px] py-1 px-5"
      />


      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border border-zinc-300 rounded-[5px] w-[300px] py-1 px-5"
      />


      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="border border-zinc-300 rounded-[5px] w-[300px] py-1 px-5"
      />


      <button onClick={handleRegister} className="bg-green-600 py-1 px-10 rounded-[5px] mx-auto cursor-pointer text-[15px] font-semibold hover:bg-green-700 hover:text-zinc-100 text-zinc-100">
        Registrasi
      </button>

      <hr />

      <Link href="/" className="bg-blue-500 py-1 px-10 rounded-[5px] mx-auto cursor-pointer text-[15px] font-semibold hover:bg-blue-700 hover:text-zinc-100">Home</Link>
      <Link href="/login" className="border py-1 px-10 rounded-[5px] mx-auto cursor-pointer text-[15px] font-semibold hover:bg-zinc-1200 hover:text-zinc-800">Login</Link>
    </div>
  );
} 