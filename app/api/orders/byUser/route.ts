import type { OrderStatus, Prisma } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("user");
  const statusFilter = searchParams.getAll("statusFilter") as OrderStatus[];

  try {
    const where: Prisma.OrdersWhereInput = { userId: Number(userId) };
    if (statusFilter.length > 0) {
      where.OR = statusFilter.map((s): Prisma.OrdersWhereInput => ({ status: s }));
    }

    const orders = await prisma.orders.findMany({
      where,
      include: {
        orderProducts: { include: { product: true } },
        user: true,
      },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка получения заказов" }, { status: 500 });
  }
}
