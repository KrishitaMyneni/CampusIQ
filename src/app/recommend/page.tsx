"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

type College = {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];
};

export default function RecommendPage() {
  const [maxFees, setMaxFees] = useState("");
  const [minRating, setMinRating] = useState("4");
  const [location, setLocation] = useState("");
  const [course, setCourse] = useState("");

  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleRecommend() {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        maxFees,
        minRating,
        location,
        course,
      });

      const res = await fetch(`/api/recommend?${params}`);

      const data = await res.json();

      setResults(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get recommendations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-6 text-slate-900 sm:p-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">CampusIQ recommends</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Filter by budget, rating, location, and course to find colleges that fit your goals.</p>
        </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="number"
            placeholder="Maximum Fees"
            value={maxFees}
            onChange={(e) => setMaxFees(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 focus:border-slate-300 focus:outline-none"
          />

          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 focus:border-slate-300 focus:outline-none"
          >
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
            <option value="4.8">4.8+</option>
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 focus:border-slate-300 focus:outline-none"
          >
            <option value="">Any Location</option>
            <option value="Hyderabad">
              Hyderabad
            </option>
            <option value="Bangalore">
              Bangalore
            </option>
            <option value="Chennai">
              Chennai
            </option>
            <option value="Mumbai">
              Mumbai
            </option>
            <option value="Delhi">
              Delhi
            </option>
          </select>

          <select
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 focus:border-slate-300 focus:outline-none"
          >
            <option value="">Any Course</option>
            <option value="Computer Science Engineering">Computer Science Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>

        <button
          onClick={handleRecommend}
          className="mt-6 rounded-md bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-900"
        >
          {loading
            ? "Loading..."
            : "🎯 Get Recommendations"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((college) => (
          <Link
            key={college.id}
            href={`/college/${college.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <article>
            <h2 className="mb-3 text-xl font-semibold text-slate-900">
              {college.name}
            </h2>

            <p className="text-slate-600">📍 {college.location}</p>

            <p className="text-slate-700">⭐ {college.rating}</p>

            <p className="text-slate-800">💰 ₹ {college.fees.toLocaleString()}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {college.courses.map((collegeCourse) => (
                <span
                  key={collegeCourse}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                >
                  {collegeCourse}
                </span>
              ))}
            </div>

            <div className="mt-4 text-sm text-emerald-700">
              <p>✓ Matches your budget</p>
              <p>✓ Meets rating requirement</p>

              {location && (
                <p>
                  ✓ Located in {college.location}
                </p>
              )}

              {course && (
                <p>
                  ✔ Offers {course}
                </p>
              )}
            </div>
            </article>
          </Link>
        ))}
      </div>
      </section>
    </main>
  );
}
