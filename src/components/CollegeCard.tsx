"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

type College = {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  description: string;
};

type Props = {
  college: College;
  selected: number[];
  toggleCollege: (id: number) => void;
};

export default function CollegeCard({
  college,
  selected,
  toggleCollege,
}: Props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSaved() {
      try {
        const res = await fetch(
          `/api/save-college?collegeId=${college.id}`
        );

        const data = await res.json();

        setSaved(data.saved);
      } catch (error) {
        console.error(error);
      }
    }

    checkSaved();
  }, [college.id]);

  async function handleSave() {
    try {
      setLoading(true);

      if (saved) {
        const res = await fetch("/api/save-college", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collegeId: college.id,
          }),
        });

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!res.ok) {
          toast.error("Failed to remove college");
          return;
        }

        setSaved(false);
        toast.success("College removed");
      } else {
        const res = await fetch("/api/save-college", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collegeId: college.id,
          }),
        });

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!res.ok) {
          toast.error("Failed to save college");
          return;
        }

        setSaved(true);
        toast.success("College saved");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <input
          type="checkbox"
          checked={selected.includes(college.id)}
          onChange={() => toggleCollege(college.id)}
        />
      </div>

      <Link href={`/college/${college.id}`}>
        <h2 className="text-xl font-semibold text-slate-900 hover:text-slate-900 cursor-pointer">
          {college.name}
        </h2>
      </Link>

      <p className="text-slate-600">📍 {college.location}</p>

      <p className="text-slate-700">⭐ {college.rating} rating</p>

      <p className="text-slate-800">💸 ₹ {college.fees.toLocaleString()} / year</p>

      <button
        onClick={handleSave}
        disabled={loading}
        className={`mt-4 rounded-md px-4 py-2 font-semibold disabled:opacity-60 ${
          saved
            ? "border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {loading
          ? "Loading..."
          : saved
          ? "❤️ Saved"
          : "❤️ Save"}
      </button>
    </article>
  );
}
