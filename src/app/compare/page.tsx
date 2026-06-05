import { prisma } from "@/lib/prisma";
import SaveComparisonButton from "@/components/SaveComparisonButton";

type Props = {
  searchParams: Promise<{
    ids?: string;
  }>;
};

export default async function ComparePage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const ids = params.ids
    ? params.ids.split(",").map(Number)
    : [];

  const colleges = await prisma.college.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  if (colleges.length < 2) {
    return (
      <main className="min-h-screen p-6 text-slate-900 sm:p-8">
        <h1 className="text-3xl font-semibold text-slate-900">
          Please select 2 colleges to compare.
        </h1>
      </main>
    );
  }

  const college1 = colleges[0];
  const college2 = colleges[1];

  return (
    <main className="min-h-screen p-6 text-slate-900 sm:p-8">
      <h1 className="text-5xl font-bold text-slate-900 mb-2">
        ⚖️ College Comparison
      </h1>

      <p className="text-slate-600 mb-8">
        Compare colleges side by side.
      </p>
      <SaveComparisonButton
  college1Id={college1.id}
  college2Id={college2.id}
/>

      <div className="overflow-x-auto">
        <table className="w-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-700">
              <th className="p-4 text-left">
                Feature
              </th>

              <th className="p-4 text-left">
                🎓 {college1.name}
              </th>

              <th className="p-4 text-left">
                🎓 {college2.name}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-slate-200">
              <td className="p-4 font-semibold">
                📍 Location
              </td>

              <td className="p-4">
                {college1.location}
              </td>

              <td className="p-4">
                {college2.location}
              </td>
            </tr>

            <tr className="border-t border-slate-200">
              <td className="p-4 font-semibold">
                ⭐ Rating
              </td>

              <td className="p-4">
                {college1.rating}
              </td>

              <td className="p-4">
                {college2.rating}
              </td>
            </tr>

            <tr className="border-t border-slate-200">
              <td className="p-4 font-semibold">
                💰 Fees
              </td>

              <td className="p-4">
                ₹ {college1.fees.toLocaleString()}
              </td>

              <td className="p-4">
                ₹ {college2.fees.toLocaleString()}
              </td>
            </tr>

            <tr className="border-t border-slate-200">
              <td className="p-4 font-semibold">
                🚀 Highest Package
              </td>

              <td className="p-4">
                ₹ {college1.highestPackage} LPA
              </td>

              <td className="p-4">
                ₹ {college2.highestPackage} LPA
              </td>
            </tr>

            <tr className="border-t border-slate-200">
              <td className="p-4 font-semibold">
                💼 Average Package
              </td>

              <td className="p-4">
                ₹ {college1.averagePackage} LPA
              </td>

              <td className="p-4">
                ₹ {college2.averagePackage} LPA
              </td>
            </tr>

            <tr className="border-t border-slate-200">
              <td className="p-4 font-semibold">
                📊 Placement Rate
              </td>

              <td className="p-4">
                {college1.placementRate}%
              </td>

              <td className="p-4">
                {college2.placementRate}%
              </td>
            </tr>

            <tr className="border-t border-slate-200">
              <td className="p-4 font-semibold">
                📝 Description
              </td>

              <td className="p-4">
                {college1.description}
              </td>

              <td className="p-4">
                {college2.description}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-xl text-slate-900 mb-3">
            🏆 Higher Rating
          </h2>

          <p className="text-slate-700">
            {college1.rating >= college2.rating
              ? college1.name
              : college2.name}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-xl text-slate-900 mb-3">
            💸 Lower Fees
          </h2>

          <p className="text-slate-700">
            {college1.fees <= college2.fees
              ? college1.name
              : college2.name}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-xl text-slate-900 mb-3">
            🚀 Better Placements
          </h2>

          <p className="text-slate-700">
            {college1.averagePackage >=
            college2.averagePackage
              ? college1.name
              : college2.name}
          </p>
        </div>
      </div>
    </main>
  );
}
