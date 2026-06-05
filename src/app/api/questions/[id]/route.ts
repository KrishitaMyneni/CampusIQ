import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, context: Context) {
  try {
    const params = await context.params;
    const questionId = Number(params.id);

    if (!Number.isInteger(questionId)) {
      return NextResponse.json(
        { error: "Invalid question id" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      question,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load question" },
      { status: 500 }
    );
  }
}
