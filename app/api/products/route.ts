import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    try {
      const productItem = await prisma.products.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          name: true,
          short: true,
          description: true,
          characteristics: true,
          features: true,
          imagePath: true,
          documentPaths: true,
          softwareArchivePaths: true,
          createdAt: true,
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!productItem) {
        return NextResponse.json(
          { error: "Товара не найдено" },
          { status: 404 }
        );
      }

      return NextResponse.json({ product: productItem });
    } catch (error) {
      console.error("Error fetching product:", error);

      return NextResponse.json(
        { error: "Ошибка получения товара" },
        { status: 500 }
      );
    }
  } else {
    try {
      const products = await prisma.products.findMany({
        select: {
          id: true,
          name: true,
          short: true,
          description: true,
          characteristics: true,
          features: true,
          imagePath: true,
          documentPaths: true,
          softwareArchivePaths: true,
          createdAt: true,
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({ products: products });
    } catch (error) {
      console.error("Error fetching products:", error);

      return NextResponse.json(
        { error: "Ошибка получения товаров" },
        { status: 500 }
      );
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, short, description, characteristics, features, categoryId } =
      await req.json();

    if (!name || !short || !description) {
      return NextResponse.json(
        { error: "Название, краткое название и описание обязательны" },
        { status: 400 }
      );
    }

    const product = await prisma.products.create({
      data: {
        name,
        short,
        description,
        characteristics: characteristics || null,
        features: features || null,
        categoryId: categoryId || null,
        documentPaths: [],
        softwareArchivePaths: [],
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Ошибка создания товара" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    }

    await prisma.products.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Ошибка удаления товара" },
      { status: 500 }
    );
  }
}
