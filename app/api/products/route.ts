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
          imagePaths: true,
          createdAt: true,
          documents: {
            select: {
              name: true,
              path: true,
            },
          },
          softwares: {
            select: {
              name: true,
              path: true,
            },
          },
          extraCharacteristics: {
            select: {
              key: true,
              value: true,
            },
          },
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
          imagePaths: true,
          createdAt: true,
          documents: {
            select: {
              name: true,
              path: true,
            },
          },
          softwares: {
            select: {
              name: true,
              path: true,
            },
          },
          extraCharacteristics: {
            select: {
              key: true,
              value: true,
            },
          },
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
    const {
      name,
      short,
      description,
      characteristics,
      features,
      categoryId,
      imagePaths,
      documentPaths,
      softwareArchivePaths,
    } = await req.json();

    const product = await prisma.products.create({
      data: {
        name,
        short,
        description,
        characteristics: characteristics || null,
        features: features || null,
        categoryId: categoryId || null,
        imagePaths: Array.isArray(imagePaths)
          ? imagePaths.filter((p) => typeof p === "string" && p.trim())
          : [],
      },
    });

    if (documentPaths?.length) {
      await prisma.productDocuments.createMany({
        data: documentPaths
          .filter((p: any) => p.name?.trim() && p.path?.trim())
          .map((p: any) => ({ ...p, productId: product.id })),
      });
    }

    if (softwareArchivePaths?.length) {
      await prisma.productSoftwares.createMany({
        data: softwareArchivePaths
          .filter((p: any) => p.name?.trim() && p.path?.trim())
          .map((p: any) => ({ ...p, productId: product.id })),
      });
    }

    const productWithRelations = await prisma.products.findUnique({
      where: { id: product.id },
      include: { documents: true, softwares: true },
    });

    return NextResponse.json(
      { product: productWithRelations },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);

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
