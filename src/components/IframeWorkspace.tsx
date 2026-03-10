"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ALLOWED_URLS, DEFAULT_URL } from "@/lib/apps";

export default function IframeWorkspace() {
  const sp = useSearchParams();
  const requested = sp.get("src") || DEFAULT_URL;

  const src = useMemo(() => {
    if (ALLOWED_URLS.has(requested)) return requested;
    return DEFAULT_URL;
  }, [requested]);

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
      <iframe
        key={src}
        src={src}
        className="w-full h-full"
        allow="clipboard-read; clipboard-write; fullscreen"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
