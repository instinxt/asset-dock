import { PrismaClient, AssetType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.asset.createMany({
    data: [
      {
        fileName: "sample-image.jpg",
        originalName: "sample-image.jpg",
        filePath: "/uploads/sample-image.jpg",
        fileSize: 123456,
        mimeType: "image/jpeg",
        assetType: AssetType.IMAGE,
        tags: ["marketing", "banner"]
      },
      {
        fileName: "report.pdf",
        originalName: "report.pdf",
        filePath: "/uploads/report.pdf",
        fileSize: 98765,
        mimeType: "application/pdf",
        assetType: AssetType.DOCUMENT,
        tags: ["finance"]
      }
    ]
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });