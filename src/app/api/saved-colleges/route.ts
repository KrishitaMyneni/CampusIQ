import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          savedColleges: [],
          savedComparisons: [],
        },
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          savedColleges: [],
          savedComparisons: [],
        },
        { status: 200 }
      );
    }

    const savedColleges =
      await prisma.savedCollege.findMany({
        where: {
          userId: user.id,
        },
        include: {
          college: true,
        },
      });

    const comparisons =
      await prisma.savedComparison.findMany({
        where: {
          userId: user.id,
        },
      });

    const savedComparisons = await Promise.all(
      comparisons.map(async (comparison) => {
        const college1 =
          await prisma.college.findUnique({
            where: {
              id: comparison.college1Id,
            },
          });

        const college2 =
          await prisma.college.findUnique({
            where: {
              id: comparison.college2Id,
            },
          });

        return {
          ...comparison,
          college1Name:
            college1?.name ?? "Unknown College",
          college2Name:
            college2?.name ?? "Unknown College",
        };
      })
    );

    return NextResponse.json({
      savedColleges,
      savedComparisons,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch saved data",
      },
      {
        status: 500,
      }
    );
  }
}