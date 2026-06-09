"use client";

import { Trash2, FileText, Film, Image as ImageIcon, File, Box } from "lucide-react";
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

interface AssetCardProps {
  asset: Asset;
  onDelete: (id: string) => void;
  onClick: (asset: Asset) => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function TypeIcon({ type }: { type: AssetType }) {
  const cls = "w-8 h-8 text-zinc-400";
  switch (type) {
    case AssetType.IMAGE: return <ImageIcon className={cls} />;
    case AssetType.VIDEO: return <Film className={cls} />;
    case AssetType.DOCUMENT: return <FileText className={cls} />;
    case AssetType.MODEL_3D: return <Box className={cls} />;
    default: return <File className={cls} />;
  }
}

export default function AssetCard({ asset, onDelete, onClick }: AssetCardProps) {
  const isImage = asset.assetType === AssetType.IMAGE;

  return (
    <div
      className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(asset)}
    >
      {/* Preview */}
      <div className="h-40 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.filePath}
            alt={asset.originalName}
            className="h-full w-full object-cover"
          />
        ) : (
          <TypeIcon type={asset.assetType} />
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-100" title={asset.originalName}>
          {asset.originalName}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {asset.assetType} · {formatBytes(asset.fileSize)}
        </p>
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.map((tag) => (
              <span key={tag} className="text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(asset.id); }}
        aria-label={`Delete ${asset.originalName}`}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-800 rounded-full p-1.5 shadow hover:bg-red-50 dark:hover:bg-red-900/30 text-zinc-500 hover:text-red-500"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
