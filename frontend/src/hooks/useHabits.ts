"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  markHabitDone,
} from "@/lib/api";
import type { CreateHabitInput, UpdateHabitInput } from "@/lib/api";
import { getTodayKey } from "@/lib/dateUtils";

export type Habit = {
  _id: string;
  title: string;
  frequency: string;
  notes?: string;
  category?: string | null;
  goal?: number | null;
  reminderTime?: string | null;
  currentStreak?: number;
  xp?: number;
  completedDates?: string[];
  isSaving?: boolean;
};

export const HABITS_QUERY_KEY = ["habits"] as const;

const queryKey = (token: string | undefined) => [...HABITS_QUERY_KEY, token ?? "anon"];

export function useHabits(token: string | undefined) {
  const queryClient = useQueryClient();
  const qk = queryKey(token);

  const query = useQuery({
    queryKey: qk,
    queryFn: () => getHabits(token!),
    enabled: !!token,
    staleTime: 60 * 1000,
    retry: 2,
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateHabitInput) => createHabit(data, token!),
    onMutate: async (newHabit) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<Habit[]>(qk);
      const temp: Habit = {
        _id: `temp-${Date.now()}`,
        title: newHabit.title,
        frequency: newHabit.frequency,
        notes: newHabit.notes,
        category: newHabit.category,
        goal: newHabit.goal,
        reminderTime: newHabit.reminderTime,
        currentStreak: 0,
        xp: 0,
        completedDates: [],
        isSaving: true,
      };
      queryClient.setQueryData<Habit[]>(qk, (old = []) => [...old, temp]);
      return { previous };
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<Habit[]>(qk, (old = []) =>
        old.map((h) =>
          h._id.startsWith("temp-") && h.isSaving
            ? { ...saved, isSaving: undefined }
            : h
        )
      );
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(qk, context.previous);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateHabitInput;
    }) => updateHabit(id, data, token!),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<Habit[]>(qk);
      queryClient.setQueryData<Habit[]>(qk, (old = []) =>
        old.map((h) => (h._id === id ? { ...h, ...data } : h))
      );
      return { previous };
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<Habit[]>(qk, (old = []) =>
        old.map((h) => (h._id === saved._id ? saved : h))
      );
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(qk, context.previous);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHabit(id, token!),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<Habit[]>(qk);
      queryClient.setQueryData<Habit[]>(qk, (old = []) =>
        old.filter((h) => h._id !== id)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(qk, context.previous);
      }
    },
  });

  const markDoneMutation = useMutation({
    mutationFn: (habitId: string) =>
      markHabitDone(habitId, token!, getTodayKey()),
    onMutate: async (habitId) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const previous = queryClient.getQueryData<Habit[]>(qk);
      const todayKey = getTodayKey();
      queryClient.setQueryData<Habit[]>(qk, (old = []) =>
        old.map((h) => {
          if (h._id !== habitId) return h;
          const dates = h.completedDates ?? [];
          if (dates.includes(todayKey)) return h;
          return {
            ...h,
            completedDates: [...dates, todayKey].sort(),
            currentStreak: (h.currentStreak ?? 0) + 1,
            xp: (h.xp ?? 0) + 10,
          };
        })
      );
      return { previous };
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<Habit[]>(qk, (old = []) =>
        old.map((h) => (h._id === saved._id ? saved : h))
      );
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(qk, context.previous);
      }
    },
  });

  return {
    habits: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    createMutation,
    updateMutation,
    deleteMutation,
    markDoneMutation,
  };
}
