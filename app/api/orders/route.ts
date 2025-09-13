import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	if (id) {
		try {
			const order = prisma.orders.findUnique({
				where: { id: Number(id) },
				include: {
					orderProducts: {
						include: { product: true },
					},
					user: true,
				},
			});

			if (!order) {
				return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
			}

			return NextResponse.json({ order: order });
		} catch (err) {
			console.error("Ошибка получения заказа:", err);

			return NextResponse.json(
				{ error: "Ошибка получения заказа" },
				{ status: 500 },
			);
		}
	} else {
		try {
			const orders = await prisma.orders.findMany({
				include: {
					orderProducts: {
						include: { product: true },
					},
					user: true,
				},
				orderBy: {
					createdAt: "asc",
				},
			});

			return NextResponse.json({ orders: orders });
		} catch (err) {
			console.error("Ошибка получения заказов:", err);

			return NextResponse.json(
				{ error: "Ошибка получения заказов" },
				{ status: 500 },
			);
		}
	}
}

export async function POST(req: NextRequest) {
	try {
		const { userId, phone, items } = await req.json();
		const order = await prisma.orders.create({
			data: {
				userId: userId ?? undefined,
				guestPhone: userId ? null : phone,
				orderProducts: {
					create: items.map((i: { id: number; count: number }) => ({
						productId: i.id,
						count: i.count,
					})),
				},
			},
		});

		return NextResponse.json({ order }, { status: 201 });
	} catch (err) {
		console.error(err);

		return NextResponse.json(
			{ error: "Ошибка создания заказа" },
			{ status: 500 },
		);
	}
}
