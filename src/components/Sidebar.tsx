"use client";

import { APP_GROUPS } from "@/lib/apps";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LogoMark, SearchIcon } from "@/components/icons";

export default function Sidebar() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const current = sp.get("src");

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return APP_GROUPS;

    return APP_GROUPS.map((g) => {
      const items = g.items.filter((i) =>
        `${g.group} ${i.label}`.toLowerCase().includes(query)
      );
      return { ...g, items };
    }).filter((g) => g.items.length > 0);
  }, [q]);

  return (
    <aside className="w-80 shrink-0 h-full bg-zinc-950 text-zinc-100 border-r border-zinc-900/60">
      <div className="px-5 pt-5 pb-4 border-b border-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white grid place-items-center">
            <LogoMark />
          </div>
          <div className="min-w-0">
            <div className="text-base font-bold leading-tight tracking-tight text-white group-hover:text-emerald-400 transition-colors">HR PORTAL</div>
            <div className="text-[10px] text-zinc-500 leading-tight uppercase tracking-[0.2em] font-medium">Enterprise Hub</div>
          </div>
        </div>

        <div className="mt-4 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Quick search..."
            className="w-full rounded-xl bg-zinc-900/40 border border-zinc-800/50 px-10 py-2.5 text-xs outline-none placeholder:text-zinc-600 focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 transition-all input-premium"
          />
        </div>
      </div>

      <nav className="px-3 py-4 h-[calc(100%-120px)] overflow-y-auto">
        <div className="space-y-4">
          {filtered.map((g) => (
            <details key={g.group} className="group" open>
              <summary className="list-none cursor-pointer select-none px-3 py-2 rounded-2xl hover:bg-zinc-900/60">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
                    {g.group}
                  </div>
                  <div className="text-zinc-500 group-open:rotate-180 transition-transform">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </summary>

              <div className="mt-2 space-y-1 px-1">
                {g.items.map((item) => {
                  const isActive = current === item.url;
                  return (
                    <Link
                      key={item.id}
                      href={`${pathname}?src=${encodeURIComponent(item.url)}`}
                      className={[
                        "group/item flex items-center justify-between gap-2 rounded-xl px-4 py-2.5 text-[13px] border transition-all duration-300",
                        isActive
                          ? "bg-white text-zinc-950 border-white shadow-lg shadow-white/5 font-bold"
                          : "bg-transparent text-zinc-400 border-transparent hover:bg-zinc-900/40 hover:text-zinc-200 hover:border-zinc-800/50",
                      ].join(" ")}
                    >
                      <span className="truncate">{item.label}</span>
                      <span
                        className={[
                          "h-2 w-2 rounded-full",
                          isActive ? "bg-emerald-500" : "bg-zinc-700",
                        ].join(" ")}
                        aria-hidden
                      />
                    </Link>
                  );
                })}
              </div>
            </details>
          ))}

          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-sm text-zinc-400">
              No apps match your search.
            </div>
          ) : null}
        </div>
      </nav>
    </aside>
  );
}
