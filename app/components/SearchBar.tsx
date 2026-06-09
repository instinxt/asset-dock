"use client";

interface SearchBarProps {
  search: string;
  type: string;
  onSearchChange: (v: string) => void;
  onTypeChange: (v: string) => void;
}

const TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "All Types", value: "" },
  { label: "IMAGE", value: "IMAGE" },
  { label: "VIDEO", value: "VIDEO" },
  { label: "DOCUMENT", value: "DOCUMENT" },
  { label: "MODEL_3D", value: "MODEL_3D" },
  { label: "OTHER", value: "OTHER" },
];

export default function SearchBar({
  search,
  type,
  onSearchChange,
  onTypeChange,
}: SearchBarProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      <input
        type="text"
        placeholder="Search by filename…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 min-w-[180px] rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
      />
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400"
      >
        {TYPE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
