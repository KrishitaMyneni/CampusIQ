"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SaveCollegeButton({
  collegeId,
}: {
  collegeId: number;
}) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSaved() {
      try {
        const res = await fetch(
          `/api/save-college?collegeId=${collegeId}`
        );

        const data = await res.json();

        setSaved(data.saved);
      } catch (error) {
        console.error(error);
      }
    }

    checkSaved();
  }, [collegeId]);

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
            collegeId,
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
            collegeId,
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
    <button
      onClick={handleSave}
      disabled={loading}
      className={`mb-6 rounded-md px-5 py-3 font-semibold disabled:opacity-60 ${
        saved
          ? "border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
          : "bg-slate-900 text-white hover:bg-slate-800"
      }`}
    >
      {loading
        ? "Loading..."
        : saved
        ? "❤️ Saved"
        : "❤️ Save College"}
    </button>
  );
}
