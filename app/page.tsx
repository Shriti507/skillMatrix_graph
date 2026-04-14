"use client";

import { useSyncExternalStore } from "react";
import { Graph } from "@/components/Graph";
import { GraphControls } from "@/components/GraphControls";
import { SidebarPanel } from "@/components/SidebarPanel";
import { SummaryPanel } from "@/components/SummaryPanel";

export default function Home() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <main className="min-h-screen bg-neutral-100 p-4">
        <div className="flex gap-6">
          <aside className="h-[calc(100vh-2rem)] w-80 animate-pulse rounded-2xl border border-gray-200 bg-white shadow-lg" />
          <section className="h-[calc(100vh-2rem)] flex-1 animate-pulse rounded-2xl border border-gray-200 bg-white shadow-md" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-4">
      <div className="flex gap-6">
        <aside className="sticky top-4 flex h-[calc(100vh-2rem)] w-80 flex-col gap-6 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-lg transition-all duration-200">
          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Dashboard
            </p>
            <h1 className="text-xl font-semibold text-gray-900">Team Skill Matrix</h1>
            <p className="text-sm text-gray-600">Overview, controls, and graph management.</p>
          </section>

          <div className="border-t border-gray-200 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Insights
            </p>
            <SummaryPanel />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Controls
            </p>
            <GraphControls />
          </div>
        </aside>

        <section className="flex h-[calc(100vh-2rem)] min-w-0 flex-1 flex-col gap-4 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-md">
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-inner transition-all duration-200">
            <div className="h-full min-h-0 w-full max-w-[1400px]">
              <Graph />
            </div>
          </div>
        </section>
      </div>
      <SidebarPanel />
    </main>
  );
}
