import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        createdAt: true,
        isAdmin: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ users: [], error: "Ошибка получения пользователей" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, email, phone, isAdmin } = await req.json();

    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    const user = await prisma.user.update({
      where: { id },
      data: { email, phone, isAdmin },
      select: {
        id: true,
        email: true,
        phone: true,
        createdAt: true,
        isAdmin: true,
      },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Ошибка обновления пользователя" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка удаления пользователя" }, { status: 500 });
  }
}
