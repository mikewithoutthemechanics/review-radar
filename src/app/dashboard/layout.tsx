"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { BusinessProvider } from "@/components/dashboard/business-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessProvider>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Sidebar />
        <main className="lg:ml-64 min-h-screen">
          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </BusinessProvider>
  );
}
