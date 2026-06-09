"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, FileUp, Loader2 } from "lucide-react";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
}

export default function UploadModal({ open, onClose, onUploaded }: UploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setError("");
      setFileName("");
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/assets/upload", { method: "POST", body: formData });
      let data: { success: boolean; error?: string } = { success: false };
      try { data = await res.json(); } catch { throw new Error(`Server error (${res.status})`); }
      if (!res.ok || !data.success) throw new Error(data.error ?? "Upload failed");
      onUploaded();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Upload Asset</h2>
          <button
            onClick={onClose}
            disabled={uploading}
            className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Drop zone / file picker */}
          <label className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-colors
            ${fileName
              ? "border-zinc-400 dark:border-zinc-500 bg-zinc-50 dark:bg-zinc-800/50"
              : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
            }`}
          >
            <FileUp className="w-8 h-8 text-zinc-400" />
            <div className="text-center">
              {fileName ? (
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 break-all">{fileName}</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Click to choose a file</p>
                  <p className="text-xs text-zinc-400 mt-1">Images, GLB, PDF and more</p>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              className="sr-only"
              disabled={uploading}
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
          </label>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !fileName}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
