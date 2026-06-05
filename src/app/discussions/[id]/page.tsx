import AnswerForm from "@/components/AnswerForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function QuestionDetailPage({ params }: Props) {
  const { id } = await params;
  const questionId = Number(id);

  if (!Number.isInteger(questionId)) {
    notFound();
  }

  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      answers: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
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

  if (!question) {
    notFound();
  }

  const college = question.college as { id: number; name: string } | null;

  return (
    <main className="min-h-screen p-6 text-slate-900 sm:p-8">
      <Link
        href={
          college
            ? `/college/${college.id}`
            : "/discussions"
        }
        className="inline-block text-slate-600 hover:text-slate-900 mb-6"
      >
        {college
          ? `Back to ${college.name}`
          : "Back to discussions"}
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              {question.title}
            </h1>

            <p className="text-slate-600">
              Asked by{" "}
              <span className="text-slate-900">
                {question.user.name || question.user.email}
              </span>{" "}
              on {formatDate(question.createdAt)}
            </p>

            {college && (
              <Link
                href={`/college/${college.id}`}
                className="inline-block text-slate-600 hover:text-slate-900 mt-3"
              >
                About {college.name}
              </Link>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
            {question._count.answers}{" "}
            {question._count.answers === 1
              ? "answer"
              : "answers"}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Answers
        </h2>

        {question.answers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-600">
              No answers yet. Be the first to reply.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {question.answers.map((answer: typeof question.answers[number]) => (
              <article
                key={answer.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-slate-800 whitespace-pre-wrap mb-4">
                  {answer.content}
                </p>

                <p className="text-sm text-slate-600">
                  Answered by{" "}
                  <span className="text-slate-900">
                    {answer.user.name || answer.user.email}
                  </span>{" "}
                  on {formatDate(answer.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <AnswerForm questionId={question.id} />
    </main>
  );
}
