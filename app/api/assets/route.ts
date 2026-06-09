import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = new Set(["IMAGE", "VIDEO", "DOCUMENT", "MODEL_3D", "OTHER"]);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") ?? "";
  const type = searchParams.get("type") ?? "";

  const assets = await prisma.asset.findMany({
    where: {
      AND: [
        search
          ? { fileName: { contains: search, mode: "insensitive" } }
          : {},
        type && VALID_TYPES.has(type)
          ? { assetType: type as any }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(assets);
}
