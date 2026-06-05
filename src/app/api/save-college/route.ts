import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
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
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ saved: false });
    }

    const { searchParams } = new URL(req.url);

    const collegeId = Number(
      searchParams.get("collegeId")
    );

    const existing =
      await prisma.savedCollege.findUnique({
        where: {
          userId_collegeId: {
            userId: user.id,
            collegeId,
          },
        },
      });

    return NextResponse.json({
      saved: !!existing,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed" },
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

    const { collegeId } = await req.json();

    const existing =
      await prisma.savedCollege.findUnique({
        where: {
          userId_collegeId: {
            userId: user.id,
            collegeId,
          },
        },
      });

    if (!existing) {
      await prisma.savedCollege.create({
        data: {
          userId: user.id,
          collegeId,
        },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to save" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { collegeId } = await req.json();

    await prisma.savedCollege.deleteMany({
      where: {
        userId: user.id,
        collegeId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to remove" },
      { status: 500 }
    );
  }
}