import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    await prisma.products.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(
      { message: "Успешное обновление просмотров продукта" },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json({
      error: "Ошибка обновления просмотров продукта",
      status: 500,
    });
  }
}
