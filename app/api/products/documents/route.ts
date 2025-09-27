import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const documents = await prisma.productDocuments.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return NextResponse.json(documents);
}
