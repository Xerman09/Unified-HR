"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoMark } from "@/components/icons";
import DynamicBackground from "@/components/DynamicBackground";

type LoginState = "idle" | "loading" | "error";

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextPath = useMemo(() => sp.get("next") || "/dashboard", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<LoginState>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setError(json?.message || "Login failed");
        return;
      }

      // Store credentials for auto-login to other integrated systems (e.g. Payroll)
      sessionStorage.setItem("unified_hr_user", email);
      sessionStorage.setItem("unified_hr_pass", password);

      router.replace(nextPath);
      router.refresh();
    } catch (err: any) {
      setState("error");
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      if (state !== "error") setState("idle");
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-zinc-950 overflow-hidden">
      {/* Dynamic Left Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-zinc-950">
        <DynamicBackground />

        <div className="flex items-center gap-3 relative z-20 transition-transform hover:scale-105 duration-300 w-fit cursor-default">
          <div className="h-10 w-10 rounded-2xl bg-white grid place-items-center shadow-2xl">
            <LogoMark className="text-zinc-950" />
          </div>
          <div className="text-white drop-shadow-lg">
            <div className="text-sm font-bold leading-tight uppercase tracking-widest">HR Portal</div>
            <div className="text-[10px] text-zinc-400 font-medium tracking-tight">Enterprise Operations</div>
          </div>
        </div>

        <div className="max-w-md relative z-20">
          <h1 className="text-5xl font-black leading-tight tracking-tighter text-white drop-shadow-2xl">
            Elevating your <br />HR experience.
          </h1>
          <p className="mt-6 text-zinc-300 leading-relaxed font-light text-lg drop-shadow-lg">
            Access restricted to authorized personnel. Please sign in with your enterprise credentials.
          </p>
        </div>

        <div className="text-[10px] text-zinc-500 font-bold tracking-[0.3em] uppercase relative z-20">
          Unified Systems Hub &copy; 2026
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-zinc-50 relative z-30">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-800 grid place-items-center shadow-xl">
              <LogoMark className="text-white" />
            </div>
            <div>
              <div className="text-lg font-bold leading-tight text-zinc-900">HR Portal</div>
              <div className="text-xs text-zinc-500 leading-tight">Sign in to continue</div>
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem] border-white shadow-2xl relative">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-zinc-400/5 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-zinc-400/5 rounded-full blur-[80px]" />

            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Sign in</h2>
                <p className="text-zinc-500 mt-2 font-medium">
                  Authorized personnel only.
                </p>
              </div>
              <div className="hidden lg:flex h-12 w-12 rounded-2xl bg-zinc-950 grid place-items-center shadow-lg shadow-zinc-200">
                <LogoMark className="opacity-90 text-white" />
              </div>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 px-5 py-4 text-sm input-premium shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 px-1">Password</label>
                <input
                  type="password"
                  className="w-full rounded-2xl border border-zinc-100 bg-zinc-50/50 px-5 py-4 text-sm input-premium shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 text-red-600 text-[11px] font-bold p-4 text-center tracking-tighter shadow-sm animate-pulse">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={state === "loading"}
                className="w-full rounded-2xl bg-zinc-950 text-white py-4 font-bold btn-premium shadow-xl shadow-zinc-200 hover:shadow-zinc-300 active:scale-[0.98] transition-all"
              >
                {state === "loading" ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  "Sign in to Dashboard"
                )}
              </button>

              <p className="text-[11px] text-zinc-400 leading-relaxed text-center px-4 font-medium italic">
                Secure enterprise connection. If issues persist, contact your supervisor.
              </p>
            </form>
          </div>

          <p className="text-[10px] text-zinc-400 mt-8 text-center font-bold tracking-[0.2em] uppercase">
            &copy; 2026 Unified Hub Operations
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
