import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const changePasswordSchema = z.object({
	oldPassword: z.string().min(6),
	newPassword: z.string().min(6),
});

export async function POST(req: NextRequest) {
	try {
		const authHeader = req.headers.get("authorization");

		console.log(authHeader);

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return NextResponse.json(
				{ message: "Вы не авторизованы" },
				{ status: 401 },
			);
		}
		const token = authHeader.substring(7);
		let payload: any;

		try {
			payload = jwt.verify(token, process.env.JWT_SECRET!);
			console.log(payload);
		} catch {
			return NextResponse.json({ message: "Неверный токен" }, { status: 401 });
		}
		const userId = payload?.userId;

		if (!userId) {
			return NextResponse.json(
				{ message: "Пользователь не найден" },
				{ status: 401 },
			);
		}
		const body = await req.json();
		const result = changePasswordSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json(
				{ message: result.error.errors[0]?.message || "Ошибка валидации" },
				{ status: 400 },
			);
		}
		const { oldPassword, newPassword } = result.data;
		const user = await prisma.user.findUnique({ where: { id: userId } });

		if (!user || !user.password) {
			return NextResponse.json(
				{ message: "Пользователь не найден" },
				{ status: 404 },
			);
		}
		const isMatch = await bcrypt.compare(oldPassword, user.password);

		if (!isMatch) {
			return NextResponse.json(
				{ message: "Старый пароль неверный" },
				{ status: 400 },
			);
		}
		const hashed = await bcrypt.hash(newPassword, 10);

		await prisma.user.update({
			where: { id: userId },
			data: { password: hashed },
		});

		return NextResponse.json({ message: "Пароль успешно изменён" });
	} catch {
		return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
	}
}
