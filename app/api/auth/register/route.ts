import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateToken, hashPassword } from "@/lib/auth";
import { sendRegistrationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^\+375 \((29|44|25|17)\) \d{3}-\d{2}-\d{2}$/),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password } = registerSchema.parse(body);

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 },
      );
    }

    const existingUserByPhone = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUserByPhone) {
      return NextResponse.json(
        { error: "Пользователь с таким телефоном уже существует" },
        { status: 400 },
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id, user.email);

    await sendRegistrationEmail(user.email, user);

    return NextResponse.json(
      {
        message: "Пользователь успешно зарегистрирован",
        user,
        token,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
