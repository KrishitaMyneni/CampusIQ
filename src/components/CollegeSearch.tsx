"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import CollegeCard from "./CollegeCard";
import TopCollegesTable from "./TopCollegesTable";

type College = {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  description: string;
};

export default function CollegeSearch() {
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [maxFees, setMaxFees] = useState("999999999");
  const [location, setLocation] = useState("");

  const [colleges, setColleges] = useState<College[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    fetch(
      `/api/colleges?search=${search}&minRating=${minRating}&maxFees=${maxFees}&location=${location}`
    )
      .then((res) => res.json())
      .then(setColleges);
  }, [search, minRating, maxFees, location]);

  function toggleCollege(id: number) {
    if (selected.includes(id)) {
      setSelected(selected.filter((c) => c !== id));
      return;
    }

    if (selected.length >= 2) {
      toast.error("You can compare only 2 colleges.");
      return;
    }

    setSelected([...selected, id]);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Explore colleges by your preferences</h2>
      </div>

      <input
        type="text"
        placeholder="Search colleges, courses, or locations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white mb-6"
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 focus:border-slate-300 focus:outline-none"
        >
          <option value="">Any Location</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
        </select>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 focus:border-slate-300 focus:outline-none"
        >
          <option value="0">Any Rating</option>
          <option value="4">4.0+</option>
          <option value="4.5">4.5+</option>
          <option value="4.8">4.8+</option>
        </select>

        <select
          value={maxFees}
          onChange={(e) => setMaxFees(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 focus:border-slate-300 focus:outline-none"
        >
          <option value="999999999">Any Fees</option>
          <option value="100000">Below ₹1 Lakh</option>
          <option value="300000">Below ₹3 Lakhs</option>
          <option value="500000">Below ₹5 Lakhs</option>
          <option value="1000000">Below ₹10 Lakhs</option>
        </select>
      </div>

      {selected.length === 2 && (
        <Link
          href={`/compare?ids=${selected.join(",")}`}
          className="mb-6 inline-flex rounded-md bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-900"
        >
          Compare Selected ⚖️
        </Link>
      )}

      {search.trim() === "" ? (
        <TopCollegesTable />
      ) : colleges.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h3 className="text-2xl font-semibold mb-2 text-slate-900">
            😔 No colleges found
          </h3>

          <p className="text-slate-600">
            Try searching with a different keyword.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              selected={selected}
              toggleCollege={toggleCollege}
            />
          ))}
        </div>
      )}
    </div>
  );
}
