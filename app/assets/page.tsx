"use client";

import { useEffect, useState, useCallback } from "react";
import { AssetType } from "@prisma/client";
import { Upload } from "lucide-react";
import SearchBar from "../components/SearchBar";
import UploadModal from "../components/UploadModal";
import AssetGrid from "../components/AssetGrid";
import AssetPreview from "../components/AssetPreview";

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

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [previewing, setPreviewing] = useState<Asset | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type) params.set("type", type);
    const res = await fetch(`/api/assets?${params}`);
    const data = await res.json();
    setAssets(data);
    setLoading(false);
  }, [search, type]);

  useEffect(() => {
    const timer = setTimeout(fetchAssets, 300);
    return () => clearTimeout(timer);
  }, [fetchAssets]);

  async function handleDelete(id: string) {
    await fetch(`/api/assets/${id}`, { method: "DELETE" });
    setAssets((prev) => prev.filter((a) => a.id !== id));
    if (previewing?.id === id) setPreviewing(null);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Asset Library
          </h1>
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>

        <div className="mb-6">
          <SearchBar
            search={search}
            type={type}
            onSearchChange={setSearch}
            onTypeChange={setType}
          />
        </div>

        {loading ? (
          <p className="text-center text-zinc-400 py-20 text-sm">Loading…</p>
        ) : (
          <AssetGrid
            assets={assets}
            onDelete={handleDelete}
            onClick={setPreviewing}
          />
        )}
      </div>

      {previewing && (
        <AssetPreview asset={previewing} onClose={() => setPreviewing(null)} />
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={fetchAssets}
      />
    </div>
  );
}
