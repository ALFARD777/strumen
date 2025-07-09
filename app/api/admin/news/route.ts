import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ news });
  } catch {
    return NextResponse.json(
      { news: [], error: "Ошибка получения новостей" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, content, published } = await req.json();

    if (!title || !content)
      return NextResponse.json(
        { error: "Заполните все поля" },
        { status: 400 }
      );
    const news = await prisma.news.create({
      data: { title, content, published: !!published },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ news });
  } catch {
    return NextResponse.json(
      { error: "Ошибка создания новости" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, title, content, published } = await req.json();

    if (!id)
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    const news = await prisma.news.update({
      where: { id },
      data: { title, content, published },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ news });
  } catch {
    return NextResponse.json(
      { error: "Ошибка обновления новости" },
      { status: 500 }
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
      { status: 500 }
    );
  }
}
