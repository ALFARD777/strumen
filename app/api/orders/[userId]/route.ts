import type { OrderStatus, Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
	req: NextRequest,
	{ params }: { params: { userId: string } },
) {
	const { userId } = await params;
	const searchParams = req.nextUrl.searchParams;
	const statusFilter = searchParams.getAll("statusFilter") as OrderStatus[];

	try {
		const where: Prisma.OrdersWhereInput = { userId: Number(userId) };
		if (statusFilter.length > 0) {
			where.OR = statusFilter.map(
				(s): Prisma.OrdersWhereInput => ({ status: s }),
			);
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
		return NextResponse.json(
			{ error: "Ошибка получения заказов" },
			{ status: 500 },
		);
	}
}
