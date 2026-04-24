import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { Suspense } from "react";
import { SidebarProvider } from "@/components/SidebarContext";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("hr_portal_session")?.value;
  const user = token ? await verifySession(token) : null;

  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="h-screen flex overflow-hidden">
        <Suspense fallback={<div className="w-80 bg-zinc-950 animate-pulse" />}>
          <Sidebar />
        </Suspense>
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav user={user} />
          <main className="flex-1 bg-zinc-50 p-5 overflow-hidden">
            <div className="h-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
