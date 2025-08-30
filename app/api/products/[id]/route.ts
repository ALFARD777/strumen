import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { name, short, description, characteristics, features, categoryId } =
      await req.json();

    if (!name || !short || !description) {
      return NextResponse.json(
        { error: "Название, краткое название и описание обязательны" },
        { status: 400 }
      );
    }

    const product = await prisma.products.update({
      where: { id },
      data: {
        name,
        short,
        description,
        characteristics: characteristics || null,
        features: features || null,
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { error: "Ошибка обновления товара" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.productExtraCharacteristic.deleteMany({
      where: { productId: id },
    });

    await prisma.products.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Ошибка удаления товара" },
      { status: 500 }
    );
  }
}
