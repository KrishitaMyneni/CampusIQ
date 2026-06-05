"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type Props = {
  questionId: number;
};

export default function AnswerForm({ questionId }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status === "unauthenticated") {
      toast.error("Please log in to answer");
      router.push("/login");
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      toast.error("Answer is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          content: trimmedContent,
        }),
      });

      if (res.status === 401) {
        toast.error("Please log in to answer");
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to post answer");
        return;
      }

      setContent("");
      toast.success("Answer posted");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
  <form
    onSubmit={handleSubmit}
    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
  >
    <h2 className="text-2xl font-bold text-slate-900 mb-4">
      Add Answer
    </h2>

    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Share your answer..."
      rows={5}
      className="w-full mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none"
    />

    <button
      type="submit"
      disabled={loading}
      className="rounded-md bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
    >
      {loading ? "Posting..." : "Post Answer"}
    </button>
  </form>
);
}
