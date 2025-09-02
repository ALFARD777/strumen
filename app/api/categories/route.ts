import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
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

export async function POST(req: NextRequest) {
  try {
    const { name, url } = await req.json();

    if (!name || !url) {
      return NextResponse.json(
        { error: "Название и URL обязательны" },
        { status: 400 }
      );
    }

    const category = await prisma.categories.create({
      data: {
        name,
        url,
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error creating category:", error);

    return NextResponse.json(
      { error: "Ошибка создания категории" },
      { status: 500 }
    );
  }
}
