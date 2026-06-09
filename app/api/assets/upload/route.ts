import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MODEL_3D_EXTS = new Set(["glb", "gltf", "obj", "fbx", "stl", "usdz"]);

function detectAssetType(mimeType: string, fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (MODEL_3D_EXTS.has(ext)) return "MODEL_3D";
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (
    mimeType === "application/pdf" ||
    mimeType.startsWith("text/") ||
    mimeType.includes("document") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("presentation")
  )
    return "DOCUMENT";
  return "OTHER";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return Response.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and make unique
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${baseName}_${Date.now()}${ext}`;
    const filePath = `/uploads/${fileName}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const dest = path.join(uploadsDir, fileName);

    // Ensure uploads directory exists
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(dest, buffer);

    const asset = await prisma.asset.create({
      data: {
        fileName,
        originalName: file.name,
        filePath,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
        assetType: detectAssetType(file.type, file.name) as any,
        tags: [],
      },
    });

    return Response.json({ success: true, asset }, { status: 201 });
  } catch (err) {
    console.error("[upload] error:", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
