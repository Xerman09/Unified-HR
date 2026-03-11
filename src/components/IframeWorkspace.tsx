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

  // Determine if we should attempt auto-login
  const isPayroll = Boolean(appMeta && isPayrollApp(appMeta));
  const credentials = useMemo(() => {
    if (typeof window === "undefined") return null;
    const email = sessionStorage.getItem("unified_hr_user");
    const pass = sessionStorage.getItem("unified_hr_pass");
    return email && pass ? { email, pass } : null;
  }, [requested]);

  const shouldAutoLogin = isPayroll && credentials && hasAutoLoggedIn !== src;

  // Final iframe source logic:
  const iframeSrc = useMemo(() => {
    // If we're on the server or not mounted, we can't seed yet
    if (!isMounted) return isPayroll ? "about:blank" : src;

    if (isPayroll && credentials) {
      try {
        // Create a "Seeding URL" with credentials for modern SPAs to catch
        const seedingUrl = new URL(src);
        seedingUrl.searchParams.set("seed_email", credentials.email);
        seedingUrl.searchParams.set("seed_pass", credentials.pass);

        console.log(`[Portal] Direct seeding navigation to: ${seedingUrl.toString()}`);
        return seedingUrl.toString();
      } catch (e) {
        return src;
      }
    }

    return src;
  }, [isMounted, isPayroll, credentials, src]);

  useEffect(() => {
    if (shouldAutoLogin && isMounted) {
      console.log(`[Portal] Initiating secure login for ${appMeta?.label}...`);
      // No need to set timer here if we're using direct URL seeding, 
      // but we'll use hasAutoLoggedIn to control the overlay
    }
  }, [shouldAutoLogin, isMounted, appMeta]);

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
        {isMounted && isPayroll && credentials && !hasAutoLoggedIn && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl pointer-events-none">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="h-20 w-20 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin" />
                <div className="absolute inset-0 border-4 border-transparent border-b-purple-500 rounded-full animate-[spin_2s_linear_infinite]" />
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="text-white font-black text-xs uppercase tracking-[0.4em] animate-pulse">
                  Seeding Payroll Session
                </div>
                <div className="text-zinc-500 text-[9px] uppercase tracking-widest font-black opacity-50">
                  Broadcasting Authorized Credentials...
                </div>
              </div>
            </div>
          </div>
        )}

        <iframe
          name="portal-app-frame"
          key={iframeSrc}
          src={iframeSrc}
          className="absolute inset-0 w-full h-full border-none"
          allow="clipboard-read; clipboard-write; fullscreen"
          referrerPolicy="no-referrer"
          onLoad={() => {
            if (isPayroll) {
              // Hide overlay after iframe loads
              setTimeout(() => setHasAutoLoggedIn(src), 1500);
            }
          }}
        />
      </div>
    </div>
  );
}
