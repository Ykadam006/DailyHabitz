"use client";

import { Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { AppHeader } from "@/components/dashboard/AppHeader";
import DashboardGuard from "@/components/DashboardGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <SidebarProvider>
        <Suspense fallback={null}>
          <AppSidebar />
        </Suspense>
        <SidebarInset>
          <AppHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </DashboardGuard>
  );
}
