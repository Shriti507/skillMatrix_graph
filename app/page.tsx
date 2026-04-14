"use client";

import { useState, useSyncExternalStore } from "react";
import { Graph } from "@/components/Graph";
import { GraphControls } from "@/components/GraphControls";
import { SidebarPanel } from "@/components/SidebarPanel";
import { SummaryPanel } from "@/components/SummaryPanel";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="flex gap-6">
          <aside className="h-[calc(100vh-2rem)] w-72 animate-pulse rounded-2xl border border-slate-700/60 bg-slate-900/60 shadow-lg" />
          <section className="h-[calc(100vh-2rem)] flex-1 animate-pulse rounded-2xl border border-slate-700/60 bg-slate-900/60 shadow-md" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.12),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="relative flex gap-6">
        <aside className="sticky top-4 flex h-[calc(100vh-2rem)] w-72 flex-col gap-6 overflow-y-auto rounded-2xl border border-slate-700/30 bg-slate-900/60 p-5 shadow-[0_14px_36px_rgba(2,6,23,0.42)] backdrop-blur-md">
          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Dashboard
            </p>
            <h1 className="text-xl font-semibold text-slate-100">Team Skill Matrix</h1>
            <p className="text-sm text-slate-300">Overview, controls, and graph management.</p>
          </section>

          <div className="space-y-3">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Insights
            </p>
            <SummaryPanel />
          </div>

          <div className="space-y-3">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Controls
            </p>
            <GraphControls />
          </div>
        </aside>

        <section className="flex h-[calc(100vh-2rem)] min-w-0 flex-1 flex-col gap-4 overflow-y-auto rounded-2xl bg-slate-900/20 p-2">
          <div className="rounded-xl bg-slate-900/60 p-3 shadow-[0_8px_26px_rgba(2,6,23,0.35)]">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search people or skills"
              className="w-full rounded-lg border border-slate-700/40 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center p-2 transition-all duration-200">
            <Graph searchQuery={searchQuery} />
          </div>
        </section>
      </div>
      <SidebarPanel />
    </main>
  );
}
