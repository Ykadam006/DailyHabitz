"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Habit } from "@/hooks/useHabits";
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

const editSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  frequency: z.enum(["daily", "weekly"]),
  notes: z.string().max(500).optional(),
});

type EditValues = z.infer<typeof editSchema>;

type Props = {
  habit: Habit;
  onClose: () => void;
  onSave: (data: { title: string; frequency: string; notes: string }) => void;
  isSaving?: boolean;
};

export default function HabitEditForm({
  habit,
  onClose,
  onSave,
  isSaving = false,
}: Props) {
  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: habit.title,
      frequency: habit.frequency as "daily" | "weekly",
      notes: habit.notes ?? "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    onSave({ title: data.title, frequency: data.frequency, notes: data.notes ?? "" });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="edit-title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="edit-title"
          placeholder="Habit title"
          {...form.register("title")}
          disabled={isSaving}
          aria-invalid={!!form.formState.errors.title}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="edit-frequency" className="text-sm font-medium">
          Frequency
        </label>
        <Select
          value={form.watch("frequency")}
          onValueChange={(v) => form.setValue("frequency", v as "daily" | "weekly")}
          disabled={isSaving}
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
        <label htmlFor="edit-notes" className="text-sm font-medium">
          Notes (optional)
        </label>
        <Textarea
          id="edit-notes"
          placeholder="Optional notes..."
          {...form.register("notes")}
          disabled={isSaving}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
