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
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/login");
    router.refresh();
  }

  function openNewTab() {
    const url = app?.url || requested;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <header className="h-16 shrink-0 bg-white border-b border-zinc-200 px-5 flex items-center justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-sm font-semibold text-zinc-900 truncate">
            {app ? app.label : "Dashboard"}
          </div>
          {app ? (
            <span className="hidden sm:inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 border border-zinc-200">
              {app.group}
            </span>
          ) : null}
        </div>
        <div className="text-xs text-zinc-500 mt-0.5 truncate">
          {user.name} • {user.email}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={openNewTab}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
          title="Open current app in a new tab"
        >
          <ExternalLink className="text-zinc-700" />
          <span className="hidden sm:inline">Open</span>
        </button>

        <button
          onClick={logout}
          className="rounded-xl bg-zinc-900 text-white px-3.5 py-2 text-sm font-medium hover:bg-zinc-800"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
