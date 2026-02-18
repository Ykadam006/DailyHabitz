"use client";

import { useEffect } from "react";
import Link from "next/link";
import { warmUpBackend } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Flame,
  Zap,
  Calendar,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  useEffect(() => {
    warmUpBackend();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - matches dashboard style */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="size-5 text-primary" />
          DailyHabitz
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/dashboard?section=today">
              Dashboard
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Hero */}
          <section className="text-center pb-12 md:pb-16">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Build better habits,
              <br />
              <span className="text-primary">one day at a time</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your daily habits, build streaks, earn XP, and watch your
              progress grow. Simple, fast, and built for consistency.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/dashboard?section=today">
                  Get Started
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard?section=insights">View Features</Link>
              </Button>
            </div>
          </section>

          {/* Features */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Flame className="size-10 rounded-lg bg-orange-500/10 p-2 text-orange-500" />
                <CardTitle className="mt-2">Streaks</CardTitle>
                <CardDescription>
                  Build consecutive-day streaks and never break the chain.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="size-10 rounded-lg bg-amber-500/10 p-2 text-amber-500" />
                <CardTitle className="mt-2">Earn XP</CardTitle>
                <CardDescription>
                  Gain 10 XP for each completion. Level up your habits.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="size-10 rounded-lg bg-green-500/10 p-2 text-green-500" />
                <CardTitle className="mt-2">5-Week Calendar</CardTitle>
                <CardDescription>
                  Visualize your progress with a clean 5-week view.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="size-10 rounded-lg bg-blue-500/10 p-2 text-blue-500" />
                <CardTitle className="mt-2">Insights</CardTitle>
                <CardDescription>
                  Track streaks, weekly completion %, and total XP.
                </CardDescription>
              </CardHeader>
            </Card>
          </section>

          {/* CTA Card */}
          <section className="mt-12 md:mt-16">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 px-6">
                <div>
                  <h2 className="text-xl font-semibold">Ready to start?</h2>
                  <p className="text-muted-foreground mt-1">
                    Create your first habit and begin building lasting change.
                  </p>
                </div>
                <Button asChild size="lg">
                  <Link href="/dashboard?section=today">
                    Go to Dashboard
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-4 md:px-6">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © DailyHabitz · Build habits, one day at a time.
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard?section=today">Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard?section=insights">Insights</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
