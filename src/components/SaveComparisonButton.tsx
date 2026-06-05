"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SaveComparisonButton({
  college1Id,
  college2Id,
}: {
  college1Id: number;
  college2Id: number;
}) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSaved() {
      try {
        const res = await fetch("/api/saved-colleges");

        const data = await res.json();

        const exists =
          data.savedComparisons?.some(
            (comparison: {
              college1Id: number;
              college2Id: number;
            }) =>
              comparison.college1Id === college1Id &&
              comparison.college2Id === college2Id
          );

        setSaved(!!exists);
      } catch (error) {
        console.error(error);
      }
    }

    checkSaved();
  }, [college1Id, college2Id]);

  async function handleSave() {
    try {
      setLoading(true);

      if (saved) {
        await fetch("/api/save-comparison", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            college1Id,
            college2Id,
          }),
        });

        setSaved(false);
        toast.success("Comparison removed");
      } else {
        const res = await fetch(
          "/api/save-comparison",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              college1Id,
              college2Id,
            }),
          }
        );

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (res.ok) {
          setSaved(true);
          toast.success("Comparison saved");
        } else {
          toast.error("Failed to save comparison");
        }
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
        ? "📚 Comparison Saved"
        : "💾 Save Comparison"}
    </button>
  );
}
