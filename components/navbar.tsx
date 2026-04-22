"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname()

  if(pathname.startsWith('/post')){
    return (
      <div className="w-full border-b px-6 py-3 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        Blog App
      </Link>

      <div className="">
      <Link href="/" className="bg-green-600 text-semibold px-3 py-2 rounded-[5px] font-semibold text-white">
              Home
            </Link>
      </div>
      </div>
    )
  }

  return (
    <div className="w-full border-b px-6 py-3 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        Blog App
      </Link>

      <div className="flex gap-4 items-center">
        {!session ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        ) : (
          <>
            <Link href="/admin" className="text-sm bg-blue-500 font-semibold px-2 py-1">
              Author : {session.user?.name}
            </Link>

            <Link href="/create-post" className="bg-green-600 text-semibold px-2 py-1 rounded-[5px] font-semibold text-white">
              Create
            </Link>

            <button
              onClick={() => signOut()}
              className="text-red-500 font-semibold border px-2 py-1 rounded-[5px]"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}