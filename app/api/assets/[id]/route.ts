import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const asset = await prisma.asset.findUnique({ where: { id } });

  if (!asset) {
    return Response.json({ error: "Asset not found" }, { status: 404 });
  }

  return Response.json(asset);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const asset = await prisma.asset.findUnique({ where: { id } });

  if (!asset) {
    return Response.json({ error: "Asset not found" }, { status: 404 });
  }

  // Remove file from disk (best-effort)
  try {
    const filePath = path.join(process.cwd(), "public", asset.filePath);
    await unlink(filePath);
  } catch {
    // File may not exist on disk (e.g. seeded records)
  }

  await prisma.asset.delete({ where: { id } });

  return Response.json({ success: true });
}
