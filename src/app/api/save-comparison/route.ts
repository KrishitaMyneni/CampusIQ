import { prisma } from "@/lib/prisma";
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

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      college1Id,
      college2Id,
    } = await req.json();

    const existing =
      await prisma.savedComparison.findFirst({
        where: {
          userId: user.id,
          college1Id,
          college2Id,
        },
      });

    if (!existing) {
      await prisma.savedComparison.create({
        data: {
          userId: user.id,
          college1Id,
          college2Id,
        },
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to save comparison" },
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

    const {
      college1Id,
      college2Id,
    } = await req.json();

    await prisma.savedComparison.deleteMany({
      where: {
        userId: user.id,
        college1Id,
        college2Id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to remove comparison" },
      { status: 500 }
    );
  }
}