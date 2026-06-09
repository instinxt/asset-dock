"use client";

import dynamic from "next/dynamic";
import { X, Download } from "lucide-react";
import { AssetType } from "@prisma/client";

const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
      Loading 3D viewer…
    </div>
  ),
});

interface Asset {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  assetType: AssetType;
  mimeType: string;
}

interface AssetPreviewProps {
  asset: Asset;
  onClose: () => void;
}

export default function AssetPreview({ asset, onClose }: AssetPreviewProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[80%]">
            {asset.originalName}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={asset.filePath}
              download={asset.originalName}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
              aria-label="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview area */}
        <div className={`flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 ${asset.assetType === AssetType.DOCUMENT && asset.mimeType === "application/pdf" ? "h-[70vh]" : "h-[480px]"}`}>
          {asset.assetType === AssetType.IMAGE && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.filePath}
              alt={asset.originalName}
              className="max-h-full max-w-full object-contain"
            />
          )}

          {asset.assetType === AssetType.VIDEO && (
            <video controls className="max-h-full max-w-full rounded">
              <source src={asset.filePath} type={asset.mimeType} />
            </video>
          )}

          {asset.assetType === AssetType.MODEL_3D && (
            <div className="h-full w-full">
              <ModelViewer modelUrl={asset.filePath} />
            </div>
          )}

          {asset.assetType === AssetType.DOCUMENT &&
            asset.mimeType === "application/pdf" && (
              <iframe
                src={asset.filePath}
                title={asset.originalName}
                className="w-full h-full border-0"
              />
            )}

          {(asset.assetType === AssetType.OTHER ||
            (asset.assetType === AssetType.DOCUMENT &&
              asset.mimeType !== "application/pdf")) && (
            <div className="flex flex-col items-center gap-4 text-zinc-400">
              <p className="text-sm">No preview available.</p>
              <a
                href={asset.filePath}
                download={asset.originalName}
                className="text-sm text-zinc-700 dark:text-zinc-300 underline"
              >
                Download file
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
