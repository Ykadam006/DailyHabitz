"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useHabits, type Habit } from "@/hooks/useHabits";
import HabitEditForm from "./HabitEditForm";
import HabitCalendar from "./HabitCalendar";
import HabitCardSkeleton from "./HabitCardSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CheckCircle2, Pencil, Trash2, Bell, Target, ChevronDown, ChevronRight } from "lucide-react";
import { transition, xpBurstVariants } from "@/lib/animation";
import { cn } from "@/lib/utils";
import { MICROCOPY } from "@/lib/microcopy";

type HabitListProps = {
  token: string | undefined;
  search?: string;
  sortBy?: "title" | "streak" | "xp" | "category";
};

export default function HabitList({
  token,
  search = "",
  sortBy = "title",
}: HabitListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inlineTitleId, setInlineTitleId] = useState<string | null>(null);
  const [inlineTitleValue, setInlineTitleValue] = useState("");
  const [notesExpanded, setNotesExpanded] = useState<Set<string>>(new Set());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [xpBurstId, setXpBurstId] = useState<string | null>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inlineTitleId) {
      inlineInputRef.current?.focus();
      inlineInputRef.current?.select();
    }
  }, [inlineTitleId]);

  const {
    habits,
    isLoading,
    isFetching,
    updateMutation,
    deleteMutation,
    markDoneMutation,
  } = useHabits(token);

  const filteredHabits = habits
    .filter((h: Habit) => {
      if (h._id.startsWith("temp-")) return true;
      const match = search
        ? h.title.toLowerCase().includes(search.toLowerCase())
        : true;
      return match;
    })
    .sort((a: Habit, b: Habit) => {
      if (a._id.startsWith("temp-")) return -1;
      if (b._id.startsWith("temp-")) return 1;
      switch (sortBy) {
        case "category":
          return (a.category ?? "").localeCompare(b.category ?? "");
        case "streak":
          return (b.currentStreak ?? 0) - (a.currentStreak ?? 0);
        case "xp":
          return (b.xp ?? 0) - (a.xp ?? 0);
        default:
          return a.title.localeCompare(b.title);
      }
    });

  const handleMarkDone = (id: string) => {
    if (id.startsWith("temp-")) return;
    setLoadingId(id);
    setXpBurstId(id);
    setTimeout(() => setXpBurstId(null), 500);
    markDoneMutation.mutate(id, {
      onSettled: () => setLoadingId(null),
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Failed to mark done");
      },
    });
  };

  const handleDelete = (id: string) => {
    if (id.startsWith("temp-")) return;
    if (!confirm("Are you sure you want to delete this habit?")) return;
    setLoadingId(id);
    deleteMutation.mutate(id, {
      onSettled: () => setLoadingId(null),
      onError: () => toast.error("Failed to delete habit"),
    });
  };

  const handleSaveEdit = (
    id: string,
    data: {
      title: string;
      frequency: string;
      notes?: string;
      category?: string;
      goal?: number;
      reminderTime?: string;
    }
  ) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => setEditingId(null),
        onError: () => toast.error("Failed to update habit"),
      }
    );
  };

  const startInlineTitleEdit = (habit: Habit) => {
    if (habit.isSaving || habit._id.startsWith("temp-")) return;
    setInlineTitleId(habit._id);
    setInlineTitleValue(habit.title);
  };

  const saveInlineTitle = (id: string) => {
    const trimmed = inlineTitleValue.trim();
    if (trimmed && trimmed !== habits.find((h: Habit) => h._id === id)?.title) {
      updateMutation.mutate(
        { id, data: { title: trimmed } },
        {
          onSuccess: () => setInlineTitleId(null),
          onError: () => toast.error("Failed to update title"),
        }
      );
    } else {
      setInlineTitleId(null);
    }
  };

  const cancelInlineTitleEdit = () => {
    setInlineTitleId(null);
  };

  const toggleNotesExpanded = (id: string) => {
    setNotesExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading && habits.length === 0) {
    return (
      <div className="space-y-6">
        <HabitCardSkeleton />
        <HabitCardSkeleton />
        <HabitCardSkeleton />
      </div>
    );
  }

  if (filteredHabits.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {search ? "No habits match your search." : MICROCOPY.addFirstHabit}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {isFetching && habits.length > 0 && (
        <div className="text-xs text-muted-foreground text-center py-1" aria-live="polite">
          Updating…
        </div>
      )}
      <AnimatePresence mode="popLayout">
        {filteredHabits.map((habit: Habit, index: number) => (
          <motion.div
            key={habit._id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, transition: transition.normal }}
            transition={{ ...transition.normal, delay: Math.min(index * 0.02, 0.15) }}
            whileHover={{ y: -2, transition: transition.fast }}
            className="rounded-xl [&:hover]:shadow-lg transition-shadow"
          >
            <Card
              className={habit.isSaving ? "opacity-80" : ""}
            >
          <CardContent className="pt-6">
            {editingId === habit._id ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={transition.normal}
              >
                <HabitEditForm
                  habit={habit}
                  onClose={() => setEditingId(null)}
                  onSave={(data) => handleSaveEdit(habit._id, data)}
                  isSaving={updateMutation.isPending}
                />
              </motion.div>
            ) : (
              <>
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0 flex-1">
                    {inlineTitleId === habit._id ? (
                      <Input
                        ref={inlineInputRef}
                        value={inlineTitleValue}
                        onChange={(e) => setInlineTitleValue(e.target.value)}
                        onBlur={() => saveInlineTitle(habit._id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveInlineTitle(habit._id);
                          if (e.key === "Escape") cancelInlineTitleEdit();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 text-lg font-semibold"
                      />
                    ) : (
                      <h3
                        className={cn(
                          "text-lg font-semibold flex items-center gap-2",
                          !habit.isSaving && !habit._id.startsWith("temp-") &&
                            "cursor-pointer hover:text-primary/90 hover:underline underline-offset-2"
                        )}
                        onClick={() => startInlineTitleEdit(habit)}
                      >
                        {habit.title}
                        {habit.isSaving && (
                          <Badge variant="secondary" className="text-xs">
                            Saving...
                          </Badge>
                        )}
                      </h3>
                    )}
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {habit.frequency}
                      {habit.goal && habit.frequency === "weekly" && ` • ${habit.goal}×/week`}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {habit.category && (
                        <Badge variant="secondary" className="text-xs">
                          {habit.category}
                        </Badge>
                      )}
                      {habit.reminderTime && (
                        <Badge variant="outline" className="text-xs flex items-center gap-0.5">
                          <Bell className="size-3" />
                          {habit.reminderTime}
                        </Badge>
                      )}
                    </div>
                    {habit.notes && (
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => toggleNotesExpanded(habit._id)}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {notesExpanded.has(habit._id) ? (
                            <ChevronDown className="size-4 shrink-0" />
                          ) : (
                            <ChevronRight className="size-4 shrink-0" />
                          )}
                          Notes
                        </button>
                        {notesExpanded.has(habit._id) && (
                          <p className="text-sm text-muted-foreground italic mt-0.5 pl-5">
                            {habit.notes}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex gap-3 mt-2 items-center">
                      {habit.frequency === "weekly" && habit.goal && (
                        <Badge variant="outline" className="flex items-center gap-0.5">
                          <Target className="size-3" />
                          Goal: {habit.goal}/week
                        </Badge>
                      )}
                      <Badge variant="outline">
                        Streak: {habit.currentStreak ?? 0}
                      </Badge>
                      <div className="relative">
                        <Badge variant="outline">XP: {habit.xp ?? 0}</Badge>
                        <AnimatePresence>
                          {xpBurstId === habit._id && (
                            <motion.span
                              key="xp-burst"
                              className="absolute -top-1 -right-1 text-xs font-semibold text-green-600 dark:text-green-400 whitespace-nowrap"
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              variants={xpBurstVariants}
                              transition={transition.fast}
                            >
                              +10
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={transition.fast}>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleMarkDone(habit._id)}
                        disabled={loadingId === habit._id || !!habit.isSaving}
                        className="w-full relative overflow-visible"
                      >
                        <motion.span
                          className="inline-flex items-center"
                          whileTap={{ scale: 1.2 }}
                          transition={transition.fast}
                        >
                          <CheckCircle2 className="size-4 mr-1" />
                        </motion.span>
                        Mark Done
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(habit._id)}
                        disabled={!!habit.isSaving}
                        className="w-full"
                      >
                        <Pencil className="size-4 mr-1" />
                        Edit
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(habit._id)}
                        disabled={loadingId === habit._id || !!habit.isSaving}
                        className="w-full"
                      >
                        <Trash2 className="size-4 mr-1" />
                        Delete
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {Array.isArray(habit.completedDates) &&
                  habit.completedDates.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <HabitCalendar completedDates={habit.completedDates} />
                    </>
                  )}
              </>
            )}
          </CardContent>
        </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
