import { promises as fs } from "node:fs";
import { type NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	if (id) {
		try {
			const newsItem = await prisma.news.findUnique({
				where: { id: Number(id) },
				select: {
					id: true,
					title: true,
					content: true,
					published: true,
					createdAt: true,
					imagePath: true,
				},
			});

			if (!newsItem) {
				return NextResponse.json(
					{ news: null, error: "Новость не найдена" },
					{ status: 404 },
				);
			}

			return NextResponse.json({ news: newsItem });
		} catch {
			return NextResponse.json(
				{ news: null, error: "Ошибка получения новости" },
				{ status: 500 },
			);
		}
	} else {
		try {
			const news = await prisma.news.findMany({
				select: {
					id: true,
					title: true,
					content: true,
					published: true,
					createdAt: true,
					imagePath: true,
				},
				orderBy: { createdAt: "desc" },
			});

			return NextResponse.json({ news: news });
		} catch {
			return NextResponse.json(
				{ news: [], error: "Ошибка получения новостей" },
				{ status: 500 },
			);
		}
	}
}

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const title = formData.get("title")?.toString();
		const content = formData.get("content")?.toString();
		const published = formData.get("published") === "true";
		const file = formData.get("image") as File | null;
		let imagePath: string | null = null;
		let ext = ".jpg";

		if (file?.name) {
			ext = path.extname(file.name) || ".jpg";
		}
		if (!title || !content)
			return NextResponse.json(
				{ error: "Заполните все поля" },
				{ status: 400 },
			);
		const created = await prisma.news.create({
			data: { title, content, published },
			select: {
				id: true,
				title: true,
				content: true,
				published: true,
				createdAt: true,
			},
		});

		if (file && typeof file.arrayBuffer === "function") {
			const arrayBuffer = await file.arrayBuffer();
			const fileName = `${created.id}${ext}`;
			const savePath = path.join(process.cwd(), "public", "news", fileName);

			await fs.writeFile(savePath, Buffer.from(arrayBuffer));
			imagePath = `/news/${fileName}`;
			await prisma.news.update({
				where: { id: created.id },
				data: { imagePath },
			});
		}
		const news = await prisma.news.findUnique({
			where: { id: created.id },
			select: {
				id: true,
				title: true,
				content: true,
				published: true,
				createdAt: true,
				imagePath: true,
			},
		});

		return NextResponse.json({ news });
	} catch {
		return NextResponse.json(
			{ error: "Ошибка создания новости" },
			{ status: 500 },
		);
	}
}

export async function PATCH(req: NextRequest) {
	try {
		const formData = await req.formData();
		const id = Number(formData.get("id"));
		const title = formData.get("title")?.toString();
		const content = formData.get("content")?.toString();
		const published = formData.get("published") === "true";
		const file = formData.get("image") as File | null;
		let imagePath: string | undefined;
		let ext = ".jpg";

		if (file?.name) {
			ext = path.extname(file.name) || ".jpg";
		}
		if (!id)
			return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
		const data: {
			title: string | undefined;
			content: string | undefined;
			published: boolean;
			imagePath?: string;
		} = { title, content, published };

		if (file && typeof file.arrayBuffer === "function") {
			const arrayBuffer = await file.arrayBuffer();
			const fileName = `${id}${ext}`;
			const savePath = path.join(process.cwd(), "public", "news", fileName);

			await fs.writeFile(savePath, Buffer.from(arrayBuffer));
			imagePath = `/news/${fileName}`;
			data.imagePath = imagePath;
		}
		const news = await prisma.news.update({
			where: { id },
			data,
			select: {
				id: true,
				title: true,
				content: true,
				published: true,
				createdAt: true,
				imagePath: true,
			},
		});

		return NextResponse.json({ news });
	} catch {
		return NextResponse.json(
			{ error: "Ошибка обновления новости" },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { id } = await req.json();

		if (!id)
			return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
		await prisma.news.delete({ where: { id } });

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json(
			{ error: "Ошибка удаления новости" },
			{ status: 500 },
		);
	}
}
