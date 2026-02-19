"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, LogOut, LayoutDashboard } from "lucide-react";
import HabitForm from "@/components/HabitForm";
import { transition } from "@/lib/animation";
import { HABIT_TEMPLATES } from "@/lib/habitTemplates";
import { useHabits } from "@/hooks/useHabits";
import { useAuthToken } from "@/hooks/useAuthToken";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MICROCOPY } from "@/lib/microcopy";
import { logoutBackend } from "@/lib/api";

export function AppHeader() {
  const { token } = useAuthToken();
  const { data: session } = useSession();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { createMutation } = useHabits(token);

  const handleTemplateAdd = (template: (typeof HABIT_TEMPLATES)[number]) => {
    if (!token) return;
    createMutation.mutate(
      {
        title: template.title,
        frequency: template.frequency,
        category: template.category,
      },
      {
        onSuccess: () => {
          toast.success(`Added "${template.title}"`);
          setSheetOpen(false);
        },
        onError: () => toast.error("Failed to add habit"),
      }
    );
  };

  const firstName = session?.user?.name?.trim().split(/\s+/)[0];

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between gap-2">
        <h1 className="text-lg font-semibold">
          {firstName ? `Hi, ${firstName}` : "Dashboard"}
        </h1>
        <div className="flex items-center gap-2">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="sm">
                  <Plus className="size-4" />
                  {MICROCOPY.addHabit}
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader className="pb-2">
                <SheetTitle>{MICROCOPY.createHabit}</SheetTitle>
              </SheetHeader>
              <div className="px-6 pt-4 pb-10 space-y-10">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    {MICROCOPY.quickAdd}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {HABIT_TEMPLATES.map((t) => (
                      <motion.div
                        key={t.title}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleTemplateAdd(t)}
                          disabled={createMutation.isPending}
                          className="h-10 w-full justify-center font-medium"
                        >
                          {t.title}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={transition.normal}
                  className="pt-8 border-t"
                >
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-6">
                    {MICROCOPY.orCustom}
                  </p>
                  <HabitForm token={token} onSuccess={() => setSheetOpen(false)} />
                </motion.div>
              </div>
            </SheetContent>
          </Sheet>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {(firstName?.[0] || session?.user?.email?.[0])?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {session?.user?.name?.trim() || session?.user?.email || "User"}
                  </span>
                  {session?.user?.email && (
                    <span className="text-xs text-muted-foreground font-normal">
                      {session.user.email}
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard?section=today">
                  <LayoutDashboard className="mr-2 size-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await logoutBackend(token);
                  signOut({ callbackUrl: "/" });
                }}
                className="text-muted-foreground"
              >
                <LogOut className="mr-2 size-4" />
                {MICROCOPY.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
