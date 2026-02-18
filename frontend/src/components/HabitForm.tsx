"use client";

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

const habitSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  frequency: z.enum(["daily", "weekly"]),
  notes: z.string().max(500).optional(),
});

type HabitFormValues = z.infer<typeof habitSchema>;

type Props = { userId: string; onSuccess?: () => void };

export default function HabitForm({ userId, onSuccess }: Props) {
  const { createMutation } = useHabits(userId);

  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: { title: "", frequency: "daily", notes: "" },
  });

  const onSubmit = form.handleSubmit((data) => {
    createMutation.mutate(
      { ...data, userId },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to create habit");
        },
      }
    );
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          placeholder="e.g. Morning run"
          {...form.register("title")}
          disabled={createMutation.isPending}
          aria-invalid={!!form.formState.errors.title}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="frequency" className="text-sm font-medium">
          Frequency
        </label>
        <Select
          value={form.watch("frequency")}
          onValueChange={(v) => form.setValue("frequency", v as "daily" | "weekly")}
          disabled={createMutation.isPending}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes (optional)
        </label>
        <Textarea
          id="notes"
          placeholder="Optional notes..."
          {...form.register("notes")}
          disabled={createMutation.isPending}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Adding..." : "Add Habit"}
      </Button>
    </form>
  );
}
