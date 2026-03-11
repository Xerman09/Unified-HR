"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ALLOWED_URLS, DEFAULT_URL, getAppMetaByUrl, isPayrollApp } from "@/lib/apps";

export default function IframeWorkspace() {
  const sp = useSearchParams();
  const requested = sp.get("src") || DEFAULT_URL;

  const [useFallback, setUseFallback] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [hasAutoLoggedIn, setHasAutoLoggedIn] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const appMeta = useMemo(() => getAppMetaByUrl(requested), [requested]);

  // Reset and check connection when the requested app changes
  useEffect(() => {
    setUseFallback(false);
    // Reset auto-login flag when switching apps
    if (hasAutoLoggedIn !== requested) {
      setHasAutoLoggedIn(null);
    }

    if (appMeta?.fallbackUrl) {
      const checkConnection = async () => {
        setIsChecking(true);
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

          await fetch(requested, {
            mode: 'no-cors',
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          setUseFallback(false);
        } catch (err) {
          console.warn(`Primary URL ${requested} unreachable, switching to fallback.`);
          setUseFallback(true);
        } finally {
          setIsChecking(false);
        }
      };

      checkConnection();
    } else {
      setIsChecking(false);
    }
  }, [requested, appMeta, hasAutoLoggedIn]);

  const src = useMemo(() => {
    if (!ALLOWED_URLS.has(requested)) return DEFAULT_URL;
    if (useFallback && appMeta?.fallbackUrl) return appMeta.fallbackUrl;
    return requested;
  }, [requested, useFallback, appMeta]);

  const iframeSrc = src;

  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 border-4 border-zinc-800 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-zinc-50 rounded-2xl border border-zinc-200">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-zinc-200 border-t-zinc-950 rounded-full animate-spin" />
          <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest animate-pulse">
            Verifying Connection...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
      {appMeta?.fallbackUrl && (
        <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${useFallback ? "bg-amber-500" : "bg-emerald-500"}`} />
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              {useFallback ? "Using Backup Server" : "Primary Server Active"}
            </span>
          </div>
          <button
            onClick={() => setUseFallback(!useFallback)}
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 transition-colors shadow-sm"
          >
            {useFallback ? "Switch to Primary" : "Connection issues? Try Backup"}
          </button>
        </div>
      )}

      <div className="flex-1 relative">
        <iframe
          name="portal-app-frame"
          key={iframeSrc}
          src={iframeSrc}
          className="absolute inset-0 w-full h-full border-none"
          allow="clipboard-read; clipboard-write; fullscreen"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
