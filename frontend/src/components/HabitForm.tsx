"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useHabits } from "@/hooks/useHabits";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HABIT_CATEGORIES } from "@/lib/habitTemplates";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const habitSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  frequency: z.enum(["daily", "weekly"]),
  notes: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  goal: z.number().min(1).max(7).optional(),
  reminderTime: z.string().max(10).optional(),
});

type HabitFormValues = z.infer<typeof habitSchema>;

type Props = {
  token: string | undefined;
  onSuccess?: () => void;
  initialValues?: Partial<HabitFormValues>;
};

export default function HabitForm({
  token,
  onSuccess,
  initialValues,
}: Props) {
  const { createMutation } = useHabits(token);
  const [addAnother, setAddAnother] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      frequency: initialValues?.frequency ?? "daily",
      notes: initialValues?.notes ?? "",
      category: initialValues?.category ?? "",
      goal: initialValues?.goal ?? undefined,
      reminderTime: initialValues?.reminderTime ?? "",
    },
  });

  const isWeekly = form.watch("frequency") === "weekly";

  const onSubmit = form.handleSubmit((data) => {
    createMutation.mutate(
      {
        ...data,
        category: data.category || undefined,
        goal: isWeekly && data.goal ? data.goal : undefined,
        reminderTime: data.reminderTime || undefined,
      },
      {
        onSuccess: () => {
          form.reset({
          title: "",
          frequency: "daily",
          notes: "",
          category: "",
          goal: undefined,
          reminderTime: "",
        });
          if (addAnother) {
            setNotesExpanded(false);
          } else {
            onSuccess?.();
          }
        },
        onError: () => {
          toast.error("Failed to create habit");
        },
      }
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.target as HTMLElement)?.tagName !== "TEXTAREA") {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} onKeyDown={handleKeyDown} className="space-y-8">
      <div className="space-y-3">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          placeholder="e.g. Morning run"
          {...form.register("title")}
          disabled={createMutation.isPending}
          aria-invalid={!!form.formState.errors.title}
          className="h-11"
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-3">
          <label htmlFor="frequency" className="text-sm font-medium">
            Frequency
          </label>
          <Select
            value={form.watch("frequency")}
            onValueChange={(v) => form.setValue("frequency", v as "daily" | "weekly")}
            disabled={createMutation.isPending}
          >
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isWeekly && (
          <div className="space-y-3">
            <label htmlFor="goal" className="text-sm font-medium">
              Goal
            </label>
            <Select
              value={form.watch("goal")?.toString() ?? ""}
              onValueChange={(v) => form.setValue("goal", v ? Number(v) : undefined)}
              disabled={createMutation.isPending}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}×/week
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-3">
          <label htmlFor="category" className="text-sm font-medium text-muted-foreground">
            Category
          </label>
          <Select
            value={form.watch("category") ?? ""}
            onValueChange={(v) => form.setValue("category", v)}
            disabled={createMutation.isPending}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Optional" />
            </SelectTrigger>
            <SelectContent>
              {HABIT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <label htmlFor="reminderTime" className="text-sm font-medium text-muted-foreground">
            Reminder
          </label>
          <Input
            id="reminderTime"
            type="time"
            {...form.register("reminderTime")}
            disabled={createMutation.isPending}
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setNotesExpanded((v) => !v)}
          className={cn(
            "flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          )}
        >
          {notesExpanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
          Notes (optional)
        </button>
        {notesExpanded && (
          <Textarea
            id="notes"
            placeholder="Optional..."
            {...form.register("notes")}
            disabled={createMutation.isPending}
            rows={3}
            className="resize-none min-h-[80px]"
          />
        )}
      </div>

      <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={addAnother}
          onChange={(e) => setAddAnother(e.target.checked)}
          className="rounded border-input"
        />
        Add another
      </label>

      <Button type="submit" className="w-full h-11" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Adding..." : "Add Habit"}
      </Button>
    </form>
  );
}
