import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  if (!query.trim()) {
    return NextResponse.json({ results: [], total: 0 }, { status: 200 });
  }

  const threeMonthAgo = new Date();
  threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3);

  const [results, total] = await Promise.all([
    prisma.products.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { short: { contains: query, mode: "insensitive" } },
          { eng: { contains: query, mode: "insensitive" } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        documents: true,
        softwares: true,
        category: {
          include: { section: true },
        },
        extraCharacteristics: true,
        productViews: {
          where: { date: { gt: threeMonthAgo } },
        },
      },
    }),
    prisma.products.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { short: { contains: query, mode: "insensitive" } },
          { eng: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  return NextResponse.json({ results, total, status: 200 });
}
