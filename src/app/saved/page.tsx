"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type SavedCollege = {
  id: number;
  college: {
    id: number;
    name: string;
    location: string;
    fees: number;
    rating: number;
  };
};

type SavedComparison = {
  id: number;
  college1Id: number;
  college2Id: number;
  college1Name: string;
  college2Name: string;
};

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedCollege[]>([]);
const [comparisons, setComparisons] =
  useState<SavedComparison[]>([]);

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/saved-colleges")
        .then((res) => res.json())
        .then((data) => {
  console.log(data);

  setSaved(data.savedColleges || []);
  setComparisons(data.savedComparisons || []);
});
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 text-slate-600 sm:p-8">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 text-slate-900 sm:p-8">
      <h1 className="text-4xl font-semibold text-slate-900 mb-8">
        ❤️ Saved Colleges
      </h1>

      {saved.length === 0 ? (
        <p className="text-slate-600">No saved colleges yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((item) => (
            <Link
              key={item.id}
              href={`/college/${item.college.id}`}
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                <h2 className="font-bold text-lg text-slate-900">
                  {item.college.name}
                </h2>

                <p className="text-slate-600">{item.college.location}</p>

                <p className="text-slate-700">⭐ {item.college.rating}</p>

                <p className="text-slate-800">
                  ₹ {item.college.fees.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-12">
  <h2 className="text-3xl font-semibold text-slate-900 mb-6">
    💾 Saved Comparisons
  </h2>

  {comparisons.length === 0 ? (
    <p className="text-slate-600">No saved comparisons yet.</p>
  ) : (
    <div className="grid md:grid-cols-2 gap-6">
      {comparisons.map((comparison) => (
        <Link
          key={comparison.id}
          href={`/compare?ids=${comparison.college1Id},${comparison.college2Id}`}
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
            <div className="space-y-2">
  <h3 className="font-bold text-lg text-slate-900">
    {comparison.college1Name}
  </h3>

  <p className="text-slate-500 font-bold">
    VS
  </p>

  <h3 className="font-bold text-lg text-slate-900">
    {comparison.college2Name}
  </h3>
</div>

            <p className="text-slate-600 mt-2">
              Click to reopen comparison
            </p>
          </div>
        </Link>
      ))}
    </div>
  )}
</div>
    </main>
  );
}
