"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Login successful");

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-slate-900 text-3xl font-semibold mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full mb-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full rounded-md bg-slate-900 py-3 text-white hover:bg-slate-900"
        >
          Login
        </button>
        <p className="mt-4 text-center text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
}
