import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET({ params }: { params: { id: string } }) {
  const { id } = await params;
  const productId = Number(id);

  const views = await prisma.productViews.findMany({
    where: { productId },
    orderBy: { date: "asc" },
    select: { date: true, count: true },
  });

  return NextResponse.json({ views });
}

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.products.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    await prisma.productViews.upsert({
      where: { productId_date: { productId: id, date: today } },
      update: { count: { increment: 1 } },
      create: { productId: id, date: today, count: 1 },
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
