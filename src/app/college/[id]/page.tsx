import AskQuestionForm from "@/components/AskQuestionForm";
import SaveCollegeButton from "@/components/SaveCollegeButton";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function CollegePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collegeId = Number(id);

  if (!Number.isInteger(collegeId)) {
    notFound();
  }

  const college = await prisma.college.findUnique({
    where: {
      id: collegeId,
    },
    include: {
      questions: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              answers: true,
            },
          },
        },
      },
    },
  });

  if (!college) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900 sm:p-8">
      <h1 className="mb-6 text-5xl font-bold text-slate-900">
        {college.name}
      </h1>

      <SaveCollegeButton collegeId={college.id} />

      <div className="space-y-6">

        {/* Overview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            📖 Overview
          </h2>

          <p className="mb-3 text-slate-700">
            📍 {college.location}
          </p>

          <p className="mb-3 text-slate-700">
            ⭐ {college.rating}
          </p>

          <p className="mb-3 text-slate-700">
            💰 ₹ {college.fees.toLocaleString()}
          </p>

          <p className="text-slate-700">{college.description}</p>
        </section>

        {/* Courses */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            📚 Courses
          </h2>

          <ul className="space-y-2 text-slate-700">
  {college.courses.map((course) => (
    <li key={course}>• {course}</li>
  ))}
</ul>
        </section>

        {/* Placements */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            💼 Placements
          </h2>

          <p className="mb-2 text-slate-700">
  Highest Package: ₹{college.highestPackage} LPA
</p>

<p className="mb-2 text-slate-700">
  Average Package: ₹{college.averagePackage} LPA
</p>

<p className="text-slate-700">
  Placement Rate: {college.placementRate}%
</p>
        </section>

        {/* Reviews */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="mb-4 text-2xl font-bold text-slate-900">
    ⭐ Reviews
  </h2>

  <p className="mb-3 text-xl text-slate-900">
    Overall Rating: ⭐ {college.rating}
  </p>

  <p className="text-slate-700">
    {college.reviewSummary}
  </p>
        </section>

        {/* Discussions */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Discussions
          </h2>

          <AskQuestionForm
            collegeId={college.id}
            heading={`Ask about ${college.name}`}
            placeholder="Ask about admissions, placements, campus life..."
          />

          {college.questions.length === 0 ? (
            <p className="text-slate-400">
              No discussions yet for this college.
            </p>
          ) : (
            <div className="space-y-4">
              {college.questions.map((question) => (
                <Link
                  key={question.id}
                  href={`/discussions/${question.id}`}
                  className="block"
                >
                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:bg-white">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {question.title}
                        </h3>

                        <p className="text-slate-600">
                          Asked by{" "}
                            <span className="text-slate-900">
                            {question.user.name ||
                              question.user.email}
                          </span>{" "}
                          on {formatDate(question.createdAt)}
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
                        {question._count.answers}{" "}
                        {question._count.answers === 1
                          ? "answer"
                          : "answers"}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
