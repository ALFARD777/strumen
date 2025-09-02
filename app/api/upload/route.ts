import path from "path";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = formData.get("path") as string | "public";

  if (!file) return NextResponse.json({ error: "Нет файла" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = Date.now() + "-" + file.name;
  const filepath = path.join(process.cwd(), folder, filename);

  await writeFile(filepath, buffer);

  return NextResponse.json({ path: filepath });
}
