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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collegeId = searchParams.get("collegeId");
    const parsedCollegeId = collegeId ? Number(collegeId) : null;

    if (
      collegeId &&
      !Number.isInteger(parsedCollegeId)
    ) {
      return NextResponse.json(
        { error: "Invalid college id" },
        { status: 400 }
      );
    }

    const questions = await prisma.question.findMany({
      where: parsedCollegeId
        ? {
            collegeId: parsedCollegeId,
          }
        : undefined,
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

    return NextResponse.json({
      questions,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load questions" },
      { status: 500 }
    );
  }
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

    const { title, collegeId } = await req.json();
    const trimmedTitle =
      typeof title === "string" ? title.trim() : "";
    const parsedCollegeId =
      collegeId === undefined || collegeId === null
        ? null
        : Number(collegeId);

    if (!trimmedTitle) {
      return NextResponse.json(
        { error: "Question title is required" },
        { status: 400 }
      );
    }

    if (
      parsedCollegeId !== null &&
      !Number.isInteger(parsedCollegeId)
    ) {
      return NextResponse.json(
        { error: "Invalid college id" },
        { status: 400 }
      );
    }

    if (parsedCollegeId !== null) {
      const college = await prisma.college.findUnique({
        where: {
          id: parsedCollegeId,
        },
        select: {
          id: true,
        },
      });

      if (!college) {
        return NextResponse.json(
          { error: "College not found" },
          { status: 404 }
        );
      }
    }

    const question = await prisma.question.create({
      data: {
        title: trimmedTitle,
        userId: user.id,
        collegeId: parsedCollegeId,
      },
    });

    return NextResponse.json(
      {
        question,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
