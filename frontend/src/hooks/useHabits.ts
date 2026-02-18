"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  markHabitDone,
} from "@/lib/api";

export type Habit = {
  _id: string;
  title: string;
  frequency: string;
  notes?: string;
  currentStreak?: number;
  xp?: number;
  completedDates?: string[];
  isSaving?: boolean;
};

export const HABITS_QUERY_KEY = ["habits"] as const;

export function useHabits(userId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...HABITS_QUERY_KEY, userId],
    queryFn: () => getHabits(userId),
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string;
      frequency: string;
      notes?: string;
      userId: string;
    }) => createHabit(data),
    onMutate: async (newHabit) => {
      await queryClient.cancelQueries({ queryKey: [...HABITS_QUERY_KEY, userId] });
      const previous = queryClient.getQueryData<Habit[]>([
        ...HABITS_QUERY_KEY,
        userId,
      ]);
      const temp: Habit = {
        _id: `temp-${Date.now()}`,
        title: newHabit.title,
        frequency: newHabit.frequency,
        notes: newHabit.notes,
        currentStreak: 0,
        xp: 0,
        completedDates: [],
        isSaving: true,
      };
      queryClient.setQueryData<Habit[]>(
        [...HABITS_QUERY_KEY, userId],
        (old = []) => [...old, temp]
      );
      return { previous };
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<Habit[]>(
        [...HABITS_QUERY_KEY, userId],
        (old = []) =>
          old.map((h) =>
            h._id.startsWith("temp-") && h.isSaving
              ? { ...saved, isSaving: undefined }
              : h
          )
      );
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          [...HABITS_QUERY_KEY, userId],
          context.previous
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...HABITS_QUERY_KEY, userId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title?: string; frequency?: string; notes?: string };
    }) => updateHabit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...HABITS_QUERY_KEY, userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...HABITS_QUERY_KEY, userId] });
    },
  });

  const markDoneMutation = useMutation({
    mutationFn: markHabitDone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...HABITS_QUERY_KEY, userId] });
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
