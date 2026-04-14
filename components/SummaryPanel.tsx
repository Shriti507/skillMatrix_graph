"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useGraphStore } from "@/store/useGraphStore";

type SkillUsageRow = {
  id: string;
  name: string;
  count: number;
};

export function SummaryPanel() {
  const isHydrated = useSyncExternalStore(
    (onStoreChange) => useGraphStore.persist.onFinishHydration(onStoreChange),
    () => useGraphStore.persist.hasHydrated(),
    () => false
  );
  const people = useGraphStore((state) => state.people);
  const skills = useGraphStore((state) => state.skills);
  const connections = useGraphStore((state) => state.connections);

  const skillUsage = useMemo<SkillUsageRow[]>(() => {
    const usageMap = new Map<string, number>();
    for (const connection of connections) {
      usageMap.set(
        connection.skillId,
        (usageMap.get(connection.skillId) ?? 0) + 1
      );
    }

    return skills
      .map((skill) => ({
        id: skill.id,
        name: skill.name,
        count: usageMap.get(skill.id) ?? 0,
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [connections, skills]);

  const mostCommonSkills = skillUsage.slice(0, 5);
  const skillGaps = skillUsage.filter((skill) => skill.count === 1);

  if (!isHydrated) {
    return (
      <section className="rounded-xl bg-slate-900/45 p-1">
        <div className="h-36 animate-pulse rounded-xl bg-slate-800/70" />
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-xl bg-slate-900/45 p-1">
      <p className="text-sm text-slate-300">
        Real-time overview computed from graph state.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-lg bg-slate-800/55 p-3 shadow-[0_8px_22px_rgba(2,6,23,0.3)] transition">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Total People
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-100">{people.length}</p>
        </article>
        <article className="rounded-lg bg-slate-800/55 p-3 shadow-[0_8px_22px_rgba(2,6,23,0.3)] transition">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Total Skills
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-100">{skills.length}</p>
        </article>
      </div>

      <div className="grid gap-5">
        <article className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Most Common Skills
          </h3>
          <ul className="flex flex-wrap gap-2">
            {mostCommonSkills.map((skill) => (
              <li
                key={skill.id}
                className="rounded-md bg-slate-800/75 px-2 py-1 text-xs text-slate-200"
              >
                {skill.name} ({skill.count})
              </li>
            ))}
          </ul>
        </article>

        <article className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Skill Gaps
          </h3>
          <p className="text-xs text-slate-400">
            Skills currently linked to exactly one person.
          </p>
          <ul className="flex flex-wrap gap-2">
            {skillGaps.length > 0 ? (
              skillGaps.map((skill) => (
                <li
                  key={skill.id}
                  className="rounded-md bg-slate-800/75 px-2 py-1 text-xs text-slate-200"
                >
                  {skill.name}
                </li>
              ))
            ) : (
              <li className="rounded-md bg-slate-800/75 px-2 py-1 text-xs text-slate-300">
                No current skill gaps.
              </li>
            )}
          </ul>
        </article>
      </div>
    </section>
  );
}
