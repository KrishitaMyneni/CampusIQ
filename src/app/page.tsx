import CollegeSearch from "@/components/CollegeSearch";

export default function Home() {
  return (
    <main className="min-h-screen p-6 text-slate-900 sm:p-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          
          <h1 className="max-w-3xl text-3xl font-semibold text-slate-900 sm:text-4xl lg:text-5xl">
          Find the right campus
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600 sm:text-lg">
            Explore top colleges, filter by budget and rating, and save your favourites in one simple dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">Top-ranked colleges</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">Budget-friendly filters</span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">Saved comparisons</span>
          </div>
        </div>

        <CollegeSearch />
      </section>
    </main>
  );
}
