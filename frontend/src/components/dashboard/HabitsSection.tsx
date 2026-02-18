"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import HabitList from "@/components/HabitList";

type Props = { userId: string };

export function HabitsSection({ userId }: Props) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "streak" | "xp">("title");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">All Habits</h2>
        <p className="text-muted-foreground">
          Manage and track all your habits
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search habits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={sortBy} onValueChange={(v: "title" | "streak" | "xp") => setSortBy(v)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Name</SelectItem>
                <SelectItem value="streak">Streak</SelectItem>
                <SelectItem value="xp">XP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <HabitList userId={userId} search={search} sortBy={sortBy} />
    </div>
  );
}
