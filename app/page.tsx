import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          AssetDock
        </h1>
        <p className="text-zinc-500 mb-6">A simple digital asset manager.</p>
        <Link
          href="/assets"
          className="inline-block rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Open Asset Library
        </Link>
      </div>
    </div>
  );
}
