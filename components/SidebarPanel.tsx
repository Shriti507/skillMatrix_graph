"use client";

import { useMemo, useState } from "react";
import { useGraphStore } from "@/store/useGraphStore";

type PersonEditorProps = {
  initialName: string;
  initialRole?: string;
  onSave: (name: string, role?: string) => void;
};

function PersonEditor({ initialName, initialRole, onSave }: PersonEditorProps) {
  const [name, setName] = useState(initialName);
  const [role, setRole] = useState(initialRole ?? "");

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Name
        </span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Role
        </span>
        <input
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      <button
        type="button"
        onClick={() => onSave(name.trim(), role.trim() || undefined)}
        className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-indigo-700"
      >
        Save changes
      </button>
    </div>
  );
}

type SkillEditorProps = {
  initialName: string;
  initialCategory?: string;
  onSave: (name: string, category?: string) => void;
};

function SkillEditor({
  initialName,
  initialCategory,
  onSave,
}: SkillEditorProps) {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState(initialCategory ?? "");

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Name
        </span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Category
        </span>
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      <button
        type="button"
        onClick={() => onSave(name.trim(), category.trim() || undefined)}
        className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-indigo-700"
      >
        Save changes
      </button>
    </div>
  );
}

export function SidebarPanel() {
  const selectedNode = useGraphStore((state) => state.selectedNode);
  const people = useGraphStore((state) => state.people);
  const skills = useGraphStore((state) => state.skills);
  const connections = useGraphStore((state) => state.connections);
  const updatePerson = useGraphStore((state) => state.updatePerson);
  const updateSkill = useGraphStore((state) => state.updateSkill);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);

  const selectedPerson =
    selectedNode?.type === "person"
      ? people.find((person) => person.id === selectedNode.id) ?? null
      : null;
  const selectedSkill =
    selectedNode?.type === "skill"
      ? skills.find((skill) => skill.id === selectedNode.id) ?? null
      : null;

  const personSkillRows = useMemo(() => {
    if (!selectedPerson) {
      return [];
    }

    return connections
      .filter((connection) => connection.personId === selectedPerson.id)
      .map((connection) => {
        const skill = skills.find((item) => item.id === connection.skillId);
        return {
          id: connection.id,
          name: skill?.name ?? connection.skillId,
          proficiency: connection.proficiency,
        };
      });
  }, [connections, selectedPerson, skills]);

  const skillPeopleRows = useMemo(() => {
    if (!selectedSkill) {
      return [];
    }

    return connections
      .filter((connection) => connection.skillId === selectedSkill.id)
      .map((connection) => {
        const person = people.find((item) => item.id === connection.personId);
        return {
          id: connection.id,
          name: person?.name ?? connection.personId,
          proficiency: connection.proficiency,
        };
      });
  }, [connections, selectedSkill, people]);

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <aside className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg transition-all duration-200">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {selectedNode.type === "person" ? "Person" : "Skill"} Details
            </p>
            <h2 className="mt-1 text-lg font-semibold text-gray-900">
              {selectedNode.type === "person" ? "Edit Person" : "Edit Skill"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSelectedNode(null)}
            className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-600 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        {selectedPerson ? (
          <PersonEditor
            key={selectedPerson.id}
            initialName={selectedPerson.name}
            initialRole={selectedPerson.role}
            onSave={(name, role) =>
              updatePerson(selectedPerson.id, {
                name: name || selectedPerson.name,
                role,
              })
            }
          />
        ) : selectedSkill ? (
          <SkillEditor
            key={selectedSkill.id}
            initialName={selectedSkill.name}
            initialCategory={selectedSkill.category}
            onSave={(name, category) =>
              updateSkill(selectedSkill.id, {
                name: name || selectedSkill.name,
                category,
              })
            }
          />
        ) : null}

        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {selectedNode.type === "person" ? "Skills" : "People"}
          </h3>
          <ul className="mt-2 space-y-2">
            {(selectedNode.type === "person" ? personSkillRows : skillPeopleRows).map(
              (row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800">{row.name}</span>
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                    {row.proficiency}
                  </span>
                </li>
              )
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}
