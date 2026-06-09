"use client";

import AssetCard from "./AssetCard";
import { AssetType } from "@prisma/client";

interface Asset {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  assetType: AssetType;
  tags: string[];
  createdAt: string;
}

interface AssetGridProps {
  assets: Asset[];
  onDelete: (id: string) => void;
  onClick: (asset: Asset) => void;
}

export default function AssetGrid({ assets, onDelete, onClick }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <p className="text-center text-zinc-400 py-20 text-sm">No assets found.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onDelete={onDelete} onClick={onClick} />
      ))}
    </div>
  );
}
