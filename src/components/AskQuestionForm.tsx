"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type Props = {
  collegeId?: number;
  heading?: string;
  placeholder?: string;
};

export default function AskQuestionForm({
  collegeId,
  heading = "Ask Question",
  placeholder = "What do you want to ask?",
}: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status === "unauthenticated") {
      toast.error("Please log in to ask a question");
      router.push("/login");
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      toast.error("Question title is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          collegeId,
        }),
      });

      if (res.status === 401) {
        toast.error("Please log in to ask a question");
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to ask question");
        return;
      }

      setTitle("");
      toast.success("Question posted");
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
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8"
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        {heading}
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-900 disabled:opacity-60"
        >
          {loading ? "Posting..." : "Post Question"}
        </button>
      </div>
    </form>
  );
}
