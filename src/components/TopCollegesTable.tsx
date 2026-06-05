"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type College = {
  id: number;
  name: string;
  location: string;
  rating: number;
};

export default function TopCollegesTable() {
  const [colleges, setColleges] = useState<College[]>([]);

  useEffect(() => {
    fetch("/api/top-colleges")
      .then((res) => res.json())
      .then(setColleges);
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-slate-900">
        🏆 Top Rated Colleges
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">College</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Rating</th>
            </tr>
          </thead>

          <tbody>
            {colleges.map((college, index) => (
              <tr
                key={college.id}
                className="border-t border-slate-200 hover:bg-slate-50"
              >
                <td className="p-4">#{index + 1}</td>

                <td className="p-4">
                  <Link
                    href={`/college/${college.id}`}
                    className="text-slate-900 hover:underline"
                  >
                    {college.name}
                  </Link>
                </td>

                <td className="p-4">
                  {college.location}
                </td>

                <td className="p-4">
                  ⭐ {college.rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}