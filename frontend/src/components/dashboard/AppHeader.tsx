"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import HabitForm from "@/components/HabitForm";

export function AppHeader() {
  const userId = "default-user";
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between gap-2">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" />
              Add Habit
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Create Habit</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <HabitForm userId={userId} onSuccess={() => setSheetOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
