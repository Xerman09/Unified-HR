"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoMark } from "@/components/icons";

type LoginState = "idle" | "loading" | "error";

export default function LoginPage() {
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

      router.replace(nextPath);
      router.refresh();
    } catch (err: any) {
      setState("error");
      setError(err?.message || "Login failed");
    } finally {
      if (state !== "error") setState("idle");
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-zinc-950 text-white">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white grid place-items-center">
            <LogoMark />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">HR Portal</div>
            <div className="text-xs text-zinc-300 leading-tight">Unified internal apps</div>
          </div>
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-semibold leading-tight">
            A single dashboard for all HR systems.
          </h1>
          <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
            Use the sidebar to switch between Men2, Vertex, and Hanvin systems. Access is
            restricted to Department 2 accounts.
          </p>
        </div>

        <div className="text-xs text-zinc-500">
          Tip: If an embedded site fails to load, check its X-Frame-Options / CSP headers.
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-zinc-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-white border border-zinc-200 grid place-items-center">
              <LogoMark />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">HR Portal</div>
              <div className="text-xs text-zinc-500 leading-tight">Sign in to continue</div>
            </div>
          </div>

          <div className="rounded-3xl bg-white shadow-sm border border-zinc-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Sign in</h2>
                <p className="text-sm text-zinc-600 mt-1">
                  Department 2 accounts only.
                </p>
              </div>
              <div className="hidden lg:block h-10 w-10 rounded-2xl bg-zinc-950 grid place-items-center">
                <LogoMark className="opacity-90" />
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-2xl border border-zinc-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-zinc-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-2xl border border-zinc-300 px-3 py-2.5 outline-none focus:ring-2 focus:ring-zinc-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 text-sm p-3">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={state === "loading"}
                className="w-full rounded-2xl bg-zinc-900 text-white py-2.5 font-medium hover:bg-zinc-800 disabled:opacity-60"
              >
                {state === "loading" ? "Signing in..." : "Sign in"}
              </button>

              <p className="text-xs text-zinc-500 leading-relaxed">
                If you can’t sign in, confirm your Directus record has <span className="font-medium">user_department = 2</span>.
              </p>
            </form>
          </div>

          <p className="text-xs text-zinc-400 mt-4 text-center">
            Internal use only.
          </p>
        </div>
      </div>
    </div>
  );
}
