"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SessionUser } from "@/lib/auth";
import { getAppMetaByUrl, DEFAULT_URL } from "@/lib/apps";
import { ExternalLink } from "@/components/icons";

export default function TopNav({ user }: { user: SessionUser }) {
  const router = useRouter();
  const sp = useSearchParams();
  const requested = sp.get("src") || DEFAULT_URL;

  const app = useMemo(() => getAppMetaByUrl(requested), [requested]);

  async function logout() {
    sessionStorage.clear();
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => { });
    router.replace("/login");
    router.refresh();
  }

  function openNewTab() {
    const url = app?.url || requested;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <header className="h-20 shrink-0 glass border-b border-zinc-200/50 px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-base font-bold text-zinc-900 tracking-tight">
            {app ? app.label : "Portal Home"}
          </div>
          {app ? (
            <span className="hidden sm:inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 border border-zinc-200">
              {app.group}
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-100 uppercase tracking-wider">
              System Ready
            </span>
          )}
        </div>
        <div className="text-xs text-zinc-500 mt-0.5 truncate">
          {user.name} • {user.email}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={openNewTab}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium btn-premium hover:bg-zinc-50"
          title="Open current app in a new tab"
        >
          <ExternalLink className="text-zinc-700" />
          <span className="hidden sm:inline">Open</span>
        </button>

        <button
          onClick={logout}
          className="rounded-xl bg-zinc-950 text-white px-5 py-2.5 text-sm font-bold shadow-lg shadow-zinc-200 btn-premium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
