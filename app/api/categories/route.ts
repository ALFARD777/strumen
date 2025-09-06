import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      select: {
        id: true,
        name: true,
        url: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);

    return NextResponse.json(
      { error: "Ошибка получения категорий" },
      { status: 500 }
    );
  }
}
