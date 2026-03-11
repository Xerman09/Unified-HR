import IframeWorkspace from "@/components/IframeWorkspace";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="h-full w-full flex items-center justify-center bg-zinc-50 rounded-2xl border border-zinc-200">
        <div className="h-8 w-8 border-4 border-zinc-200 border-t-zinc-950 rounded-full animate-spin" />
      </div>
    }>
      <IframeWorkspace />
    </Suspense>
  );
}
