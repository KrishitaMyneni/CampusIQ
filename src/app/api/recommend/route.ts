import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const maxFees = Number(
    searchParams.get("maxFees") || 999999999
  );

  const minRating = Number(
    searchParams.get("minRating") || 0
  );

  const location =
    searchParams.get("location") || "";

  const course = searchParams.get("course") || "";

  const colleges = await prisma.college.findMany({
    where: {
      fees: {
        lte: maxFees,
      },

      rating: {
        gte: minRating,
      },

      ...(location
        ? {
            location: {
              contains: location,
              mode: "insensitive",
            },
          }
        : {}),

      ...(course
        ? {
            courses: {
              has: course,
            },
          }
        : {}),
    },

    orderBy: {
      rating: "desc",
    },

    take: 10,
  });

  return NextResponse.json(colleges);
}
