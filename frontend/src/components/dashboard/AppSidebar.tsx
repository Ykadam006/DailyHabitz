"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, Calendar, ListTodo, Trophy } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams.get("section") ?? "today";

  const navItems = [
    { title: "Today", section: "today", icon: LayoutDashboard },
    { title: "All Habits", section: "habits", icon: ListTodo },
    { title: "Calendar", section: "calendar", icon: Calendar },
    { title: "Insights", section: "insights", icon: Trophy },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2 px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="size-4" />
          </div>
          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            DailyHabitz
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.section}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard" && section === item.section}
                    tooltip={item.title}
                  >
                    <Link href={`/dashboard?section=${item.section}`}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
