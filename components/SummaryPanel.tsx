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
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200">
      <h2 className="text-base font-semibold text-gray-900">Summary</h2>
      <p className="text-sm text-gray-600">
        Real-time overview computed from graph state.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:scale-[1.01] hover:shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Total People
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{people.length}</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:scale-[1.01] hover:shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Total Skills
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{skills.length}</p>
        </article>
      </div>

      <div className="grid gap-4">
        <article className="rounded-xl border border-gray-200 p-4 shadow-sm transition hover:scale-[1.01] hover:shadow-md">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Most Common Skills
          </h3>
          <ul className="mt-2 space-y-2">
            {mostCommonSkills.map((skill) => (
              <li
                key={skill.id}
                className="flex items-center justify-between rounded-lg bg-indigo-50 px-3 py-2 text-sm transition-all duration-200 hover:bg-indigo-100"
              >
                <span className="font-medium text-gray-800">{skill.name}</span>
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  {skill.count}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-gray-200 p-4 shadow-sm transition hover:scale-[1.01] hover:shadow-md">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Skill Gaps
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Skills currently linked to exactly one person.
          </p>
          <ul className="mt-2 space-y-2">
            {skillGaps.length > 0 ? (
              skillGaps.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm transition-all duration-200 hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800">{skill.name}</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {skill.count}
                  </span>
                </li>
              ))
            ) : (
              <li className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                No current skill gaps.
              </li>
            )}
          </ul>
        </article>
      </div>
    </section>
  );
}
