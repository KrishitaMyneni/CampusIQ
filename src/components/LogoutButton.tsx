"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: "/login",
        })
      }
      className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
    >
      Logout
    </button>
  );
}