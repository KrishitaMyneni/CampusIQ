import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      savedColleges: true,
      questions: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
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
      },
      answers: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          question: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-6 text-slate-900 sm:p-8">
      <h1 className="text-3xl font-semibold text-slate-900 mb-2 sm:text-4xl">
        👤 Profile
      </h1>

      <p className="text-slate-600 mb-8">
        Your CampusIQ account details.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-2xl">
        <div className="mb-6">
          <h2 className="text-slate-400 mb-1">
            Name
          </h2>

          <p className="text-xl font-semibold">
            {user.name || "Not Set"}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-slate-400 mb-1">
            Email
          </h2>

          <p className="text-xl font-semibold">
            {user.email}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-slate-400 mb-1">
            Saved Colleges
          </h2>

          <p className="text-xl font-semibold">
            ❤️ {user.savedColleges.length}
          </p>
        </div>

        <div>
          <h2 className="text-slate-400 mb-1">
            Member Since
          </h2>

          <p className="text-xl font-semibold">
            {user.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
          Activity
        </h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Questions asked
          </h3>

          {user.questions.length === 0 ? (
            <p className="text-slate-600">
              You haven&apos;t asked any questions yet.
            </p>
          ) : (
            <div className="space-y-4">
              {user.questions.map((question) => (
                <Link
                  key={question.id}
                  href={`/discussions/${question.id}`}
                  className="block"
                >
                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">
                      {question.title}
                    </h4>

                    <p className="text-sm text-slate-600">
                      {formatDate(question.createdAt)} ·{" "}
                      {question._count.answers}{" "}
                      {question._count.answers === 1
                        ? "answer"
                        : "answers"}
                    </p>

                    {question.college && (
                      <p className="text-sm text-slate-500 mt-2">
                        About {question.college.name}
                      </p>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Answers given
          </h3>

          {user.answers.length === 0 ? (
            <p className="text-slate-600">
              You haven&apos;t posted any answers yet.
            </p>
          ) : (
            <div className="space-y-4">
              {user.answers.map((answer) => (
                <Link
                  key={answer.id}
                  href={`/discussions/${answer.question.id}`}
                  className="block"
                >
                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                    <p className="text-sm text-slate-500 mb-2">
                      Re: {answer.question.title}
                    </p>

                    <p className="text-slate-800 line-clamp-3 whitespace-pre-wrap">
                      {answer.content}
                    </p>

                    <p className="text-sm text-slate-600 mt-3">
                      {formatDate(answer.createdAt)}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mt-8">
        <LogoutButton />
      </div>
    </main>
  );
}
