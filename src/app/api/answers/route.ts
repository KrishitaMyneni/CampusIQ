import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { questionId, content } = await req.json();
    const parsedQuestionId = Number(questionId);
    const trimmedContent =
      typeof content === "string" ? content.trim() : "";

    if (!Number.isInteger(parsedQuestionId)) {
      return NextResponse.json(
        { error: "Invalid question id" },
        { status: 400 }
      );
    }

    if (!trimmedContent) {
      return NextResponse.json(
        { error: "Answer is required" },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: {
        id: parsedQuestionId,
      },
      select: {
        id: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const answer = await prisma.answer.create({
      data: {
        content: trimmedContent,
        questionId: parsedQuestionId,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        answer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create answer" },
      { status: 500 }
    );
  }
}
