"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface UploadFormProps {
  onUploaded: () => void;
}

export default function UploadForm({ onUploaded }: UploadFormProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server error (${res.status})`);
      }
      if (!res.ok || !data.success) throw new Error(data.error ?? "Upload failed");
      if (inputRef.current) inputRef.current.value = "";
      onUploaded();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 flex-wrap">
      <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm text-zinc-600 dark:text-zinc-400">
        <Upload className="w-4 h-4" />
        <span>{inputRef.current?.files?.[0]?.name ?? "Choose file"}</span>
        <input ref={inputRef} type="file" className="sr-only" />
      </label>
      <button
        type="submit"
        disabled={uploading}
        className="rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {uploading ? "Uploading…" : "Upload"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
