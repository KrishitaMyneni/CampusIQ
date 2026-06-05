import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";

  const minRating = Number(
    searchParams.get("minRating") || 0
  );

  const maxFees = Number(
    searchParams.get("maxFees") || 999999999
  );

  const location =
    searchParams.get("location") || "";

  const colleges = await prisma.college.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },

      rating: {
        gte: minRating,
      },

      fees: {
        lte: maxFees,
      },

      ...(location
        ? {
            location: {
              contains: location,
              mode: "insensitive",
            },
          }
        : {}),
    },

    take: 20,

    orderBy: {
      rating: "desc",
    },
  });

  return NextResponse.json(colleges);
}