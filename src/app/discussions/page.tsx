import AskQuestionForm from "@/components/AskQuestionForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function DiscussionsPage() {
  const questions = await prisma.question.findMany({
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
      college: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen p-6 text-slate-900 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2 sm:text-4xl">
          Discussions
        </h1>

        <p className="text-slate-400">
          Ask questions and help other students make better college decisions.
        </p>
      </div>

      <AskQuestionForm />

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold mb-2">
              No questions yet
            </h2>

            <p className="text-slate-400">
              Start the first discussion.
            </p>
          </div>
        ) : (
          questions.map((question) => (
            <Link
              key={question.id}
              href={`/discussions/${question.id}`}
              className="block"
            >
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {question.title}
                    </h2>

                    <p className="text-slate-600">
                      Asked by{" "}
                      <span className="text-slate-900">
                        {question.user.name || question.user.email}
                      </span>{" "}
                      on {formatDate(question.createdAt)}
                    </p>

                    {question.college && (
                      <p className="text-sm text-slate-500 mt-2">
                        About {question.college.name}
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                    {question._count.answers}{" "}
                    {question._count.answers === 1
                      ? "answer"
                      : "answers"}
                  </div>
                </div>
              </article>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
