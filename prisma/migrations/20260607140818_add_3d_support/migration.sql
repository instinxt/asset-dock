-- AlterEnum
ALTER TYPE "AssetType" ADD VALUE 'MODEL_3D';

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "dimensions" JSONB,
ADD COLUMN     "polygons" INTEGER,
ADD COLUMN     "vertices" INTEGER;
