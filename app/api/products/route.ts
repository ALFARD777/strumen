import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/types";
import { translit } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const threeMonthAgo = new Date();
  threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3);

  if (id) {
    try {
      const product = await prisma.products.findUnique({
        where: { id: Number(id) },
        include: {
          documents: true,
          softwares: true,
          category: {
            include: { section: true },
          },
          extraCharacteristics: true,
          productViews: {
            where: { date: { gt: threeMonthAgo } },
          },
        },
      });

      if (!product) {
        return NextResponse.json({ error: "Товара не найдено" }, { status: 404 });
      }

      return NextResponse.json({ product: product });
    } catch (error) {
      console.error("Ошибка получения товара:", error);

      return NextResponse.json({ error: "Ошибка получения товара" }, { status: 500 });
    }
  } else {
    try {
      const products: Product[] = await prisma.products.findMany({
        orderBy: { id: "desc" },
        include: {
          documents: true,
          softwares: true,
          category: {
            include: { section: true },
          },
          extraCharacteristics: true,
          productViews: {
            where: { date: { gt: threeMonthAgo } },
          },
        },
      });

      return NextResponse.json({ products: products });
    } catch (error) {
      console.error("Ошибка получения товаров:", error);

      return NextResponse.json({ error: "Ошибка получения товаров" }, { status: 500 });
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

      imagePaths,
      documents,
      softwares,
      extraCharacteristics,

      categoryId,
    } = await req.json();

    const exists = await prisma.products.count({
      where: {
        OR: [{ short }, { eng: translit(short) }],
      },
    });

    if (exists) {
      return NextResponse.json({ error: "Это имя уже занято" }, { status: 400 });
    }

    const product = await prisma.products.create({
      data: {
        name,
        short,
        eng: translit(short),
        description,
        characteristics: characteristics || null,
        features: features || null,
        categoryId: categoryId || null,
        imagePaths: Array.isArray(imagePaths) ? imagePaths.filter((p) => typeof p === "string" && p.trim()) : [],
      },
    });

    if (documents?.length) {
      await prisma.productDocuments.createMany({
        data: documents
          .filter((p: { name: string; path: string }) => p.name?.trim() && p.path?.trim())
          .map((p: { name: string; path: string }) => ({
            ...p,
            productId: product.id,
          })),
      });
    }

    if (softwares?.length) {
      await prisma.productSoftwares.createMany({
        data: softwares
          .filter((p: { name: string; path: string }) => p.name?.trim() && p.path?.trim())
          .map((p: { name: string; path: string }) => ({
            ...p,
            productId: product.id,
          })),
      });
    }

    if (extraCharacteristics?.length) {
      await prisma.productExtraCharacteristic.createMany({
        data: extraCharacteristics
          .filter((p: { key: string; value: string }) => p.key?.trim())
          .map((p: { name: string; path: string }) => ({
            ...p,
            productId: product.id,
          })),
      });
    }

    const productWithRelations = await prisma.products.findUnique({
      where: { id: product.id },
      include: {
        documents: true,
        softwares: true,
        extraCharacteristics: true,
        category: true,
      },
    });

    return NextResponse.json({ product: productWithRelations }, { status: 201 });
  } catch (err) {
    console.error(err);

    return NextResponse.json({ error: "Ошибка создания товара" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const params = await req.json();
    const id = params.id;
    const {
      name,
      short,
      description,
      characteristics,
      features,

      imagePaths,
      documents,
      softwares,
      extraCharacteristics,

      categoryId,
    } = params.data;

    if (!name || !short || !description) {
      return NextResponse.json({ error: "Название, краткое название и описание обязательны" }, { status: 400 });
    }

    const product = await prisma.products.update({
      where: { id },
      data: {
        name,
        short,
        eng: translit(short),
        description,
        characteristics: characteristics || null,
        features: features || null,
        categoryId: categoryId || null,
        imagePaths: Array.isArray(imagePaths) ? imagePaths.filter((p) => typeof p === "string" && p.trim()) : [],
      },
    });

    await prisma.productDocuments.deleteMany({ where: { productId: id } });
    await prisma.productSoftwares.deleteMany({ where: { productId: id } });
    await prisma.productExtraCharacteristic.deleteMany({
      where: { productId: id },
    });

    if (documents?.length) {
      await prisma.productDocuments.createMany({
        data: documents
          .filter((p: { name: string; path: string }) => p.name?.trim() && p.path?.trim())
          .map((p: { name: string; path: string }) => ({
            ...p,
            productId: product.id,
          })),
      });
    }

    if (softwares?.length) {
      await prisma.productSoftwares.createMany({
        data: softwares
          .filter((p: { name: string; path: string }) => p.name?.trim() && p.path?.trim())
          .map((p: { name: string; path: string }) => ({
            ...p,
            productId: product.id,
          })),
      });
    }

    if (extraCharacteristics?.length) {
      await prisma.productExtraCharacteristic.createMany({
        data: extraCharacteristics
          .filter((p: { key: string; value: string }) => p.key?.trim())
          .map((p: { name: string; path: string }) => ({
            ...p,
            productId: product.id,
          })),
      });
    }

    const productWithRelations = await prisma.products.findUnique({
      where: { id: product.id },
      include: {
        documents: true,
        softwares: true,
        extraCharacteristics: true,
        category: true,
      },
    });

    return NextResponse.json({ productWithRelations }, { status: 201 });
  } catch (err) {
    console.log(err);

    return NextResponse.json({ error: "Ошибка обновления товара" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    }

    await prisma.productDocuments.deleteMany({ where: { productId: id } });
    await prisma.productSoftwares.deleteMany({ where: { productId: id } });
    await prisma.productExtraCharacteristic.deleteMany({
      where: { productId: id },
    });
    await prisma.products.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка удаления товара" }, { status: 500 });
  }
}
