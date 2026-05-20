"use client";

import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
